// Redis cache layer for the application
// This file keeps the cache API simple so controllers can use it directly.

let cacheStore = {};
const DEFAULT_TTL = 600; // 10 minutes in seconds

// Fetch from cache and parse JSON before returning
export const getCache = (key) => {
    try {
        const cachedEntry = cacheStore[key];

        if (!cachedEntry) {
            return null;
        }

        if (cachedEntry.expiresAt && Date.now() > cachedEntry.expiresAt) {
            delete cacheStore[key];
            return null;
        }

        return JSON.parse(cachedEntry.value);
    } catch (error) {
        console.error("Cache get error:", error);
        return null;
    }
};

// Store JSON in cache with TTL
export const setCache = (key, data, ttl = DEFAULT_TTL) => {
    try {
        const ttlNumber = Number(ttl)
        const normalizedTtl = Number.isFinite(ttlNumber)
            ? Math.min(600, Math.max(300, ttlNumber))
            : DEFAULT_TTL

        cacheStore[key] = {
            value: JSON.stringify(data),
            expiresAt: Date.now() + (normalizedTtl * 1000)
        };

        return true;
    } catch (error) {
        console.error("Cache set error:", error);
        return false;
    }
};

// Remove cache key
export const deleteCache = (key) => {
    try {
        delete cacheStore[key];
        return true;
    } catch (error) {
        console.error("Cache delete error:", error);
        return false;
    }
};