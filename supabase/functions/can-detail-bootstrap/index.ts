// @ts-nocheck
import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
}

const unauthAuth = {
  isAuthenticated: false,
  isAnonymous: false,
  canSkipKonto: false,
  userId: null,
}

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  })

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({
        design: null,
        profile: null,
        viewer: { id: null },
        auth: unauthAuth,
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    let shareId = ""
    let accessToken = ""

    try {
      const body = await req.json()
      shareId = typeof body?.shareId === "string" ? body.shareId.trim() : ""
      accessToken = typeof body?.accessToken === "string" ? body.accessToken : ""
    } catch {
      shareId = ""
    }

    let viewer = null
    if (accessToken) {
      const { data: viewerData, error: viewerError } = await adminClient.auth.getUser(accessToken)
      if (!viewerError) {
        viewer = viewerData?.user || null
      }
    }

    if (!shareId) {
      return jsonResponse({
        design: null,
        profile: null,
        viewer: { id: viewer?.id || null },
        auth: viewer
          ? {
              isAuthenticated: true,
              isAnonymous: !!viewer.is_anonymous,
              canSkipKonto: !viewer.is_anonymous,
              userId: viewer.id,
            }
          : unauthAuth,
      })
    }

    const { data: design } = await adminClient
      .from("designs")
      .select("*")
      .eq("share_id", shareId)
      .maybeSingle()

    if (!design?.user_id) {
      return jsonResponse({
        design: null,
        profile: null,
        viewer: { id: viewer?.id || null },
        auth: viewer
          ? {
              isAuthenticated: true,
              isAnonymous: !!viewer.is_anonymous,
              canSkipKonto: !viewer.is_anonymous,
              userId: viewer.id,
            }
          : unauthAuth,
      })
    }

    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", design.user_id)
      .maybeSingle()

    return jsonResponse({
      design: design || null,
      profile: profile || null,
      viewer: { id: viewer?.id || null },
      auth: viewer
        ? {
            isAuthenticated: true,
            isAnonymous: !!viewer.is_anonymous,
            canSkipKonto: !viewer.is_anonymous,
            userId: viewer.id,
          }
        : unauthAuth,
    })
  } catch (err) {
    return jsonResponse({
      error: err instanceof Error ? err.message : String(err),
      design: null,
      profile: null,
      viewer: { id: null },
      auth: unauthAuth,
    })
  }
})
