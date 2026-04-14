import supabase from "../../../../lib/supabase";

const FUNCTION_NAME = "designer-bootstrap";
const BOOTSTRAP_CACHE_TTL_MS = 4000;

let cachedBootstrapResult = null;
let cachedAtMs = 0;
let inFlightBootstrapPromise = null;

const isObject = (value) => value !== null && typeof value === "object";

const normalizeLatestDesign = (value) => {
    if (!isObject(value)) return null;

    const designData = value.design_data ?? value.designData ?? value.data ?? null;
    const shareId = value.share_id ?? value.shareId ?? null;

    return {
        ...value,
        design_data: isObject(designData) ? designData : null,
        share_id: shareId,
    };
};

const normalizeBootstrapPayload = (payload) => {
    const root = isObject(payload?.data) ? payload.data : payload;
    if (!isObject(root)) return null;

    const latestDesign = normalizeLatestDesign(
        root.latestDesign ?? root.latest_design ?? root.design ?? null
    );

    const auth = isObject(root.auth)
        ? {
              ...root.auth,
              canSkipKonto:
                  root.auth.canSkipKonto ??
                  root.auth.can_skip_konto ??
                  root.auth.canSkipkonto ??
                  null,
          }
        : {
              canSkipKonto:
                  root.canSkipKonto ??
                  root.can_skip_konto ??
                  null,
          };

    return {
        ...root,
        auth,
        latestDesign,
    };
};

export const invokeDesignerBootstrap = async () => {
    if (!supabase?.functions?.invoke) {
        return { data: null, error: null };
    }

    const now = Date.now();
    if (cachedBootstrapResult && now - cachedAtMs < BOOTSTRAP_CACHE_TTL_MS) {
        return cachedBootstrapResult;
    }

    if (inFlightBootstrapPromise) {
        return inFlightBootstrapPromise;
    }

    inFlightBootstrapPromise = (async () => {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
            method: "POST",
            body: {
                accessToken: session?.access_token || null,
            },
        });

        if (error) {
            const result = { data: null, error };
            cachedBootstrapResult = result;
            cachedAtMs = Date.now();
            return result;
        }

        const normalizedData = normalizeBootstrapPayload(data);
        const result = { data: normalizedData, error: null };
        cachedBootstrapResult = result;
        cachedAtMs = Date.now();
        return result;
    } catch (caughtError) {
        const result = { data: null, error: caughtError };
        cachedBootstrapResult = result;
        cachedAtMs = Date.now();
        return result;
    }
    })();

    try {
        return await inFlightBootstrapPromise;
    } finally {
        inFlightBootstrapPromise = null;
    }
};
