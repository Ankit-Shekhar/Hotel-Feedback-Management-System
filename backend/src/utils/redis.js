// Redis utility for caching operations
// In production, connect to a real Redis instance
// For development, you can use redis package or a mock

let redisStore = {}; // Mock Redis store for development
const CACHE_TTL = 600; // 10 minutes in seconds

// Get cached data
export const getCache = (key) => {
    try {
        const cached = redisStore[key];
        if (cached) {
            // Check if cache has expired
            if (cached.expiresAt && Date.now() > cached.expiresAt) {
                delete redisStore[key];
                return null;
            }
            return cached.data;
        }
        return null;
    } catch (error) {
        console.error("Cache get error:", error);
        return null;
    }
};

// Set cache with TTL (Time To Live) in seconds
export const setCache = (key, data, ttl = CACHE_TTL) => {
    try {
        redisStore[key] = {
            data,
            expiresAt: Date.now() + (ttl * 1000) // Convert seconds to milliseconds
        };
        return true;
    } catch (error) {
        console.error("Cache set error:", error);
        return false;
    }
};

// Delete specific cache key
export const deleteCache = (key) => {
    try {
        delete redisStore[key];
        return true;
    } catch (error) {
        console.error("Cache delete error:", error);
        return false;
    }
};

// Delete multiple cache keys by pattern
export const deleteCacheByPattern = (pattern) => {
    try {
        Object.keys(redisStore).forEach(key => {
            if (key.includes(pattern)) {
                delete redisStore[key];
            }
        });
        return true;
    } catch (error) {
        console.error("Cache delete pattern error:", error);
        return false;
    }
};

// Clear all cache
export const clearAllCache = () => {
    try {
        redisStore = {};
        return true;
    } catch (error) {
        console.error("Cache clear error:", error);
        return false;
    }
};
