// @ts-nocheck
import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
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
        auth: {
          isAuthenticated: false,
          isAnonymous: false,
          canSkipKonto: false,
          userId: null,
        },
        latestDesign: null,
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    let accessToken = ""
    try {
      const body = await req.json()
      if (body && typeof body.accessToken === "string") {
        accessToken = body.accessToken
      }
    } catch {
      accessToken = ""
    }

    if (!accessToken) {
      return jsonResponse({
        auth: {
          isAuthenticated: false,
          isAnonymous: false,
          canSkipKonto: false,
          userId: null,
        },
        latestDesign: null,
      })
    }

    const { data: userData, error: userError } = await adminClient.auth.getUser(accessToken)
    const user = userError ? null : userData?.user || null

    if (!user) {
      return jsonResponse({
        auth: {
          isAuthenticated: false,
          isAnonymous: false,
          canSkipKonto: false,
          userId: null,
        },
        latestDesign: null,
      })
    }

    const { data: latestDesign } = await adminClient
      .from("designs")
      .select("id, share_id, design_data")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return jsonResponse({
      auth: {
        isAuthenticated: true,
        isAnonymous: !!user.is_anonymous,
        canSkipKonto: !user.is_anonymous,
        userId: user.id,
      },
      latestDesign: latestDesign || null,
    })
  } catch (err) {
    return jsonResponse({
      error: err instanceof Error ? err.message : String(err),
      auth: {
        isAuthenticated: false,
        isAnonymous: false,
        canSkipKonto: false,
        userId: null,
      },
      latestDesign: null,
    })
  }
})
