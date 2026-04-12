import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { deleteCache } from "../utils/cache.js";

// Submit feedback with 30-day rule (global rendezvous feedback)
const submitFeedback = asyncHandler(async (req, res) => {
    const { userName, email, contactNumber, ratings, suggestion } = req.body;
    const normalizedContactNumber = String(contactNumber || "").trim();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Validation: Check all required fields
    if (!userName || !userName.trim()) {
        throw new ApiError(400, "User name is required");
    }

    if (!normalizedContactNumber) {
        throw new ApiError(400, "Contact number is required");
    }

    if (normalizedEmail) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(normalizedEmail)) {
            throw new ApiError(400, "Email format is invalid");
        }
    }

    if (!ratings || typeof ratings !== "object") {
        throw new ApiError(400, "Ratings object is required");
    }

    if (!ratings.overall || !ratings.food || !ratings.service || !ratings.ambience) {
        throw new ApiError(400, "All rating fields (overall, food, service, ambience) are required");
    }

    const ratingValues = [ratings.overall, ratings.food, ratings.service, ratings.ambience];
    if (!ratingValues.every((val) => typeof val === "number" && Number.isFinite(val) && val >= 1 && val <= 5)) {
        throw new ApiError(400, "All ratings must be between 1 and 5");
    }

    if (typeof suggestion !== "string" || !suggestion.trim()) {
        throw new ApiError(400, "Suggestion is required");
    }

    if (suggestion.length > 500) {
        throw new ApiError(400, "Suggestion must not exceed 500 characters");
    }

    // Find latest feedback by contact for 30-day update rule
    const existing = await Feedback.findOne({
        $or: [
            { contactNumber: normalizedContactNumber },
            { contact: normalizedContactNumber }
        ]
    }).sort({ createdAt: -1 });

    let feedback;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (existing && existing.createdAt > thirtyDaysAgo) {
        existing.ratings = {
            overall: ratings.overall,
            food: ratings.food,
            service: ratings.service,
            ambience: ratings.ambience
        };
        existing.suggestion = suggestion.trim();
        existing.email = normalizedEmail || null;
        existing.contactNumber = normalizedContactNumber;
        existing.contact = normalizedContactNumber;
        existing.updatedAt = new Date();
        await existing.save();
        feedback = existing;
    } else {
        feedback = await Feedback.create({
            hotelId: null,
            userName: userName.trim(),
            email: normalizedEmail || null,
            contactNumber: normalizedContactNumber,
            contact: normalizedContactNumber,
            ratings: {
                overall: ratings.overall,
                food: ratings.food,
                service: ratings.service,
                ambience: ratings.ambience
            },
            suggestion: suggestion.trim()
        });
    }

    // Cache invalidation
    deleteCache("dashboard:stats");

    return res.status(201).json(
        new ApiResponse(201, "Feedback submitted successfully", feedback)
    );
});

// Get recent feedbacks globally (top 10-20)
const getRecentFeedbacks = asyncHandler(async (req, res) => {
    const { limit = 15 } = req.query;

    const parsedLimit = Number.parseInt(limit, 10);
    const limitNum = Number.isNaN(parsedLimit) ? 15 : Math.max(10, Math.min(20, parsedLimit));

    const feedbacks = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(limitNum);

    return res.status(200).json(
        new ApiResponse(200, "Recent feedbacks retrieved successfully", feedbacks)
    );
});

export { submitFeedback, getRecentFeedbacks };
