// errorMiddleware: Global error handler for all errors
// Catches errors from routes and middlewares, formats response consistently
// Response format:
// {
//   "success": false,
//   "message": "Error message",
//   "statusCode": 400,
//   "errors": []
// }
export const errorMiddleware = (error, req, res, next) => {
    // Default error status and message
    let statusCode = error?.statusCode || 500;
    let message = error?.message || "Internal Server Error";
    let errors = error?.errors || [];

    // Log error for debugging
    console.error(`[Error] Status: ${statusCode}, Message: ${message}`);

    // Handle specific error types
    if (error?.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(error.errors).map((err) => err.message);
    }

    if (error?.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (error?.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value entered";
    }

    if (error?.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (error?.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired";
    }

    // Send error response
    return res.status(statusCode).json({
        success: false,
        message: message,
        statusCode: statusCode,
        errors: errors,
        // Stack trace only in development
        ...(process.env.NODE_ENV === "development" && { stack: error?.stack })
    });
};
