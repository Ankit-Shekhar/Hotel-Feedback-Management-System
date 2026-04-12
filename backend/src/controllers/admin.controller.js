import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { Feedback } from "../models/feedback.model.js";
import { deleteCache, getCache, setCache } from "../utils/cache.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const SUPER_ADMIN_USERNAME = "ankit";
const SUPER_ADMIN_PASSWORD = "ankit123";

const generateAdminToken = async ({ adminId = null, username, role }) => {
    try {
        if (!process.env.ADMIN_TOKEN_SECRET) {
            throw new ApiError(500, "ADMIN_TOKEN_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                _id: adminId,
                username,
                role
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
    const normalizedUsername = username?.trim();

    if (!normalizedUsername) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    if (normalizedUsername === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
        const token = await generateAdminToken({
            username: SUPER_ADMIN_USERNAME,
            role: "super-admin"
        });

        return res.status(200)
            .cookie("adminToken", token, options)
            .json(
                new ApiResponse(
                    200,
                    "Super admin logged in successfully",
                    {
                        admin: {
                            username: SUPER_ADMIN_USERNAME,
                            role: "super-admin",
                            isSuperAdmin: true
                        },
                        token
                    }
                )
            );
    }

    const admin = await Admin.findOne({ username: normalizedUsername });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const token = await generateAdminToken({
        adminId: admin._id,
        username: admin.username,
        role: "admin"
    });
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    return res.status(200)
        .cookie("adminToken", token, options)
        .json(
            new ApiResponse(
                200,
                "Admin logged in successfully",
                {
                    admin: {
                        ...loggedInAdmin.toObject(),
                        role: "admin",
                        isSuperAdmin: false
                    },
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

const deleteFeedbacksBulk = asyncHandler(async (req, res) => {
    const feedbackIds = Array.isArray(req.body?.feedbackIds) ? req.body.feedbackIds : [];

    if (!feedbackIds.length) {
        throw new ApiError(400, "At least one feedback id is required");
    }

    const uniqueIds = [...new Set(feedbackIds.map((id) => String(id).trim()).filter(Boolean))];
    const validIds = uniqueIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (!validIds.length) {
        throw new ApiError(400, "No valid feedback ids provided");
    }

    const result = await Feedback.deleteMany({
        _id: { $in: validIds }
    });

    deleteCache("dashboard:stats");

    return res.status(200).json(
        new ApiResponse(200, "Selected feedbacks deleted successfully", {
            requested: uniqueIds.length,
            deleted: result.deletedCount
        })
    );
});

const deleteAllFeedbacks = asyncHandler(async (_req, res) => {
    const result = await Feedback.deleteMany({});

    deleteCache("dashboard:stats");

    return res.status(200).json(
        new ApiResponse(200, "All feedbacks deleted successfully", {
            deleted: result.deletedCount
        })
    );
});

export { loginAdmin, getDashboardStats, deleteFeedbacksBulk, deleteAllFeedbacks };
