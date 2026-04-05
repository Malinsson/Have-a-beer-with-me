const CACHE_PREFIX = "have-a-beer-with-me:";

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getStorage = () => {
    if (!isBrowser()) return null;
    return window.localStorage;
};

export const getCachedValue = (key) => {
    const storage = getStorage();
    if (!storage) return null;

    try {
        const raw = storage.getItem(`${CACHE_PREFIX}${key}`);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;

        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            storage.removeItem(`${CACHE_PREFIX}${key}`);
            return null;
        }

        return parsed.value ?? null;
    } catch {
        return null;
    }
};

export const setCachedValue = (key, value, ttlMs = 5 * 60 * 1000) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.setItem(
            `${CACHE_PREFIX}${key}`,
            JSON.stringify({
                value,
                expiresAt: Date.now() + ttlMs,
            })
        );
    } catch {
        // Ignore quota and serialization failures.
    }
};

export const removeCachedValue = (key) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        storage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch {
        // Ignore cache removal errors.
    }
};

export const removeCachedValuesByPrefix = (keyPrefix) => {
    const storage = getStorage();
    if (!storage) return;

    try {
        const fullPrefix = `${CACHE_PREFIX}${keyPrefix}`;
        const keysToRemove = [];

        for (let i = 0; i < storage.length; i += 1) {
            const key = storage.key(i);
            if (key && key.startsWith(fullPrefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach((key) => {
            storage.removeItem(key);
        });
    } catch {
        // Ignore cache removal errors.
    }
};
