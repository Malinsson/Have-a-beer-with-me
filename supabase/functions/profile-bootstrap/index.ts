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
        profile: null,
        design: null,
        latestDesign: null,
        savedCans: [],
        shelf: [],
        viewer: { id: null },
        auth: unauthAuth,
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    let slug = ""
    let includeShelf = false
    let accessToken = ""

    try {
      const body = await req.json()
      slug = typeof body?.slug === "string" ? body.slug.trim() : ""
      includeShelf = Boolean(body?.includeShelf)
      accessToken = typeof body?.accessToken === "string" ? body.accessToken : ""
    } catch {
      slug = ""
    }

    let viewer = null
    if (accessToken) {
      const { data: viewerData, error: viewerError } = await adminClient.auth.getUser(accessToken)
      if (!viewerError) {
        viewer = viewerData?.user || null
      }
    }

    if (!slug) {
      return jsonResponse({
        profile: null,
        design: null,
        latestDesign: null,
        savedCans: [],
        shelf: [],
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
      .eq("slug_value", slug)
      .maybeSingle()

    if (!profile?.id) {
      return jsonResponse({
        profile: null,
        design: null,
        latestDesign: null,
        savedCans: [],
        shelf: [],
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

    const { data: latestDesign } = await adminClient
      .from("designs")
      .select("id, name, design_data, share_id, created_at, updated_at, user_id")
      .eq("user_id", profile.id)
      .not("design_data", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    let savedCans = []

    if (includeShelf) {
      const { data: savedRows } = await adminClient
        .from("saved_designs")
        .select(`
          id,
          share_id,
          created_at,
          designs:design_id (
            id,
            user_id,
            design_data
          )
        `)
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })

      const ownerIds = Array.from(
        new Set((savedRows || []).map((item) => item.designs?.user_id).filter(Boolean))
      )

      let profileMap = {}
      if (ownerIds.length > 0) {
        const { data: ownerProfiles } = await adminClient
          .from("profiles")
          .select("id, first_name, last_name, slug_value")
          .in("id", ownerIds)

        profileMap = (ownerProfiles || []).reduce((acc, ownerProfile) => {
          acc[ownerProfile.id] = ownerProfile
          return acc
        }, {})
      }

      savedCans = (savedRows || []).map((item) => {
        const design = item.designs
        const designData = design?.design_data || {}
        const ownerProfile = profileMap[design?.user_id] || null

        return {
          savedId: item.id,
          designId: design?.id,
          ownerSlug: ownerProfile?.slug_value,
          ownerFirstName: ownerProfile?.first_name || "",
          ownerLastName: ownerProfile?.last_name || "",
          department: designData?.back?.department || "",
          name: designData?.name,
          front: designData?.front,
          back: designData?.back,
          design_data: designData,
        }
      })
    }

    return jsonResponse({
      profile,
      design: latestDesign || null,
      latestDesign: latestDesign || null,
      savedCans,
      shelf: savedCans,
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
      profile: null,
      design: null,
      latestDesign: null,
      savedCans: [],
      shelf: [],
      viewer: { id: null },
      auth: unauthAuth,
    })
  }
})
