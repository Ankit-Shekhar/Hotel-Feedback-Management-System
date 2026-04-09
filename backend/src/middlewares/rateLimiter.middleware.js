import { ApiError } from "../utils/ApiErrors.js";

// rateLimiter: Prevent abuse by limiting requests per IP
// Limit: 100 requests per 15 minutes per IP address
// Can be customized by passing options
export const createRateLimiter = (options = {}) => {
    // Default options
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        maxRequests = 100, // Max 100 requests per window
        message = "Too many requests from this IP, please try again later"
    } = options;

    // Store: { ip: { count, resetTime } }
    const requestStore = {};

    return (req, res, next) => {
        try {
            // Get client IP (supports proxies)
            const clientIP =
                req.headers["x-forwarded-for"]?.split(",")[0] ||
                req.socket.remoteAddress ||
                req.connection.remoteAddress;

            const now = Date.now();

            // Initialize or check IP in store
            if (!requestStore[clientIP]) {
                requestStore[clientIP] = {
                    count: 1,
                    resetTime: now + windowMs
                };
            } else {
                // Reset count if window has passed
                if (now > requestStore[clientIP].resetTime) {
                    requestStore[clientIP] = {
                        count: 1,
                        resetTime: now + windowMs
                    };
                } else {
                    // Increment count
                    requestStore[clientIP].count += 1;

                    // Check if limit exceeded
                    if (requestStore[clientIP].count > maxRequests) {
                        throw new ApiError(429, message);
                    }
                }
            }

            // Add rate limit info to response headers
            const remaining = maxRequests - requestStore[clientIP].count;
            const resetTime = requestStore[clientIP].resetTime;

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining));
            res.setHeader("X-RateLimit-Reset", new Date(resetTime).toISOString());

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Export default rate limiter with standard settings
export const rateLimiter = createRateLimiter();
