import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

// authMiddleware: Protect admin routes
// Verify JWT token from header and attach admin to req.admin
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header (Bearer token format)
        // also support tokens from cookies for admin
        const token = req.cookies?.adminToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access token missing");
        }

        // Verify JWT token using ADMIN_TOKEN_SECRET
        const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET || "admin-secret-key");

        // Get admin from DB using decoded token ID
        const admin = await Admin.findById(decodedToken?._id).select("-password");

        if (!admin) {
            throw new ApiError(401, "Invalid access token (admin not found)");
        }

        // Attach admin to request object for use in next middleware/controller
        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Token verification failed");
    }
};
