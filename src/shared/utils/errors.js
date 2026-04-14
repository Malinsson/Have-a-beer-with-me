const NETWORK_PATTERNS = ["failed to fetch", "network", "timeout", "load failed"];

const includesAny = (value, patterns) => {
    const text = String(value || "").toLowerCase();
    return patterns.some((pattern) => text.includes(pattern));
};

export const normalizeError = (error, fallbackMessage = "Nagot gick fel.") => {
    const raw = error;
    const status = Number(error?.status) || null;
    const code = error?.code ? String(error.code) : null;
    const message =
        typeof error === "string"
            ? error
            : error?.message || error?.error_description || fallbackMessage;

    let normalizedCode = "unexpected";

    if (status === 401 || status === 403 || code === "401" || code === "403") {
        normalizedCode = "auth";
    } else if (status === 404 || code === "PGRST116" || includesAny(message, ["not found"])) {
        normalizedCode = "not_found";
    } else if (status >= 500) {
        normalizedCode = "server";
    } else if (includesAny(message, NETWORK_PATTERNS)) {
        normalizedCode = "network";
    }

    return {
        code: normalizedCode,
        message,
        status,
        details: error?.details || null,
        retryable: normalizedCode === "network" || normalizedCode === "server",
        raw,
    };
};

export const createNotFoundError = (message = "Resursen hittades inte") => ({
    code: "not_found",
    message,
    status: 404,
});
