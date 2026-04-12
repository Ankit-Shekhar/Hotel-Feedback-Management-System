import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { Feedback } from "../models/feedback.model.js";
import { getCache, setCache } from "../utils/cache.js";
import jwt from "jsonwebtoken";

const generateAdminToken = async (adminId) => {
    try {
        if (!process.env.ADMIN_TOKEN_SECRET) {
            throw new ApiError(500, "ADMIN_TOKEN_SECRET is not configured");
        }

        const admin = await Admin.findById(adminId);

        const token = jwt.sign(
            {
                _id: admin._id,
                username: admin.username
            },
            process.env.ADMIN_TOKEN_SECRET,
            {
                expiresIn: process.env.ADMIN_TOKEN_EXPIRY || "7d"
            }
        );

        return token;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating admin token");
    }
};

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const token = await generateAdminToken(admin._id);
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    return res.status(200)
        .cookie("adminToken", token, options)
        .json(
            new ApiResponse(
                200,
                "Admin logged in successfully",
                {
                    admin: loggedInAdmin,
                    token
                }
            )
        );
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalFeedbacks = await Feedback.countDocuments();

    const cachedStats = getCache("dashboard:stats");
    if (cachedStats && Number(cachedStats.totalFeedbacks) === totalFeedbacks) {
        return res.status(200).json(
            new ApiResponse(200, "Dashboard stats retrieved successfully", cachedStats)
        );
    }
    const ratingDocs = await Feedback.find().select("ratings");

    let averageOverall = 0;
    let averageFood = 0;
    let averageService = 0;
    let averageAmbience = 0;

    if (ratingDocs.length > 0) {
        const sumOverall = ratingDocs.reduce((sum, doc) => sum + (doc.ratings?.overall || 0), 0);
        const sumFood = ratingDocs.reduce((sum, doc) => sum + (doc.ratings?.food || 0), 0);
        const sumService = ratingDocs.reduce((sum, doc) => sum + (doc.ratings?.service || 0), 0);
        const sumAmbience = ratingDocs.reduce((sum, doc) => sum + (doc.ratings?.ambience || 0), 0);

        averageOverall = parseFloat((sumOverall / ratingDocs.length).toFixed(2));
        averageFood = parseFloat((sumFood / ratingDocs.length).toFixed(2));
        averageService = parseFloat((sumService / ratingDocs.length).toFixed(2));
        averageAmbience = parseFloat((sumAmbience / ratingDocs.length).toFixed(2));
    }

    const stats = {
        totalFeedbacks,
        averageRatings: {
            overall: averageOverall,
            food: averageFood,
            service: averageService,
            ambience: averageAmbience
        }
    };

    setCache("dashboard:stats", stats, 600);

    return res.status(200).json(
        new ApiResponse(200, "Dashboard stats retrieved successfully", stats)
    );
});

export { loginAdmin, getDashboardStats };
