import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { Hotel } from "../models/hotel.model.js";
import { deleteCache } from "../utils/cache.js";

// Calculate average rating from array of feedbacks
const calculateAverageRating = (feedbacks, fieldName) => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.ratings[fieldName], 0);
    return parseFloat((sum / feedbacks.length).toFixed(2));
};

// Submit feedback with 30-day rule
const submitFeedback = asyncHandler(async (req, res) => {
    const { hotelId, userName, email, contactNumber, ratings, suggestion } = req.body;
    const normalizedContactNumber = String(contactNumber || "").trim();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Validation: Check all required fields
    if (!hotelId || !hotelId.trim()) {
        throw new ApiError(400, "Hotel ID is required");
    }

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

    if (!ratings || typeof ratings !== 'object') {
        throw new ApiError(400, "Ratings object is required");
    }

    if (!ratings.overall || !ratings.food || !ratings.service || !ratings.ambience) {
        throw new ApiError(400, "All rating fields (overall, food, service, ambience) are required");
    }

    // Validate rating values are between 1-5
    const ratingValues = [ratings.overall, ratings.food, ratings.service, ratings.ambience];
    if (!ratingValues.every((val) => typeof val === "number" && Number.isFinite(val) && val >= 1 && val <= 5)) {
        throw new ApiError(400, "All ratings must be between 1 and 5");
    }

    if (typeof suggestion !== "string") {
        throw new ApiError(400, "Suggestion must be a string");
    }

    if (!suggestion.trim()) {
        throw new ApiError(400, "Suggestion is required");
    }

    if (suggestion.length > 500) {
        throw new ApiError(400, "Suggestion must not exceed 500 characters");
    }

    // STEP 1: Validate hotel exists
    const hotel = req.hotel || await Hotel.findById(hotelId);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // STEP 2: Find latest feedback by hotelId and contact
    const existing = await Feedback.findOne({
        hotelId,
        $or: [
            { contactNumber: normalizedContactNumber },
            { contact: normalizedContactNumber }
        ]
    }).sort({ createdAt: -1 });

    let feedback;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (existing) {
        // STEP 3: Apply 30-day rule
        if (existing.createdAt > thirtyDaysAgo) {
            // CASE A: Feedback exists AND < 30 days old → UPDATE
            existing.ratings = {
                overall: ratings.overall,
                food: ratings.food,
                service: ratings.service,
                ambience: ratings.ambience
            };
            existing.suggestion = suggestion;
            existing.email = normalizedEmail || null;
            existing.contactNumber = normalizedContactNumber;
            existing.contact = normalizedContactNumber;
            existing.updatedAt = new Date();
            await existing.save();
            feedback = existing;
        } else {
            // CASE B: Feedback exists AND ≥ 30 days old → CREATE NEW
            feedback = await Feedback.create({
                hotelId,
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
    } else {
        // CASE C: No feedback exists → CREATE NEW
        feedback = await Feedback.create({
            hotelId,
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

    // STEP 4: Recalculate Hotel ratingsSummary
    const feedbacks = await Feedback.find({ hotelId });

    const averages = {
        overall: calculateAverageRating(feedbacks, 'overall'),
        food: calculateAverageRating(feedbacks, 'food'),
        service: calculateAverageRating(feedbacks, 'service'),
        ambience: calculateAverageRating(feedbacks, 'ambience')
    };

    // STEP 5: Update Hotel with new averages and total reviews
    hotel.ratingsSummary = averages;
    hotel.totalReviews = feedbacks.length;
    await hotel.save();

    // STEP 6: REDIS CACHE INVALIDATION
    deleteCache(`hotel:${hotelId}`);
    deleteCache("hotels:all");
    deleteCache("dashboard:stats");

    return res.status(201).json(
        new ApiResponse(201, "Feedback submitted successfully", feedback)
    );
});

// Get feedback for a specific hotel with pagination and sorting
const getFeedbackByHotel = asyncHandler(async (req, res) => {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!hotelId || !hotelId.trim()) {
        throw new ApiError(400, "Hotel ID is required");
    }

    // Validate hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // Convert to numbers for pagination
    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);
    const pageNum = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const limitNum = Number.isNaN(parsedLimit) ? 10 : Math.max(1, Math.min(100, parsedLimit)); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Fetch total count for pagination
    const total = await Feedback.countDocuments({ hotelId });

    // Fetch feedbacks sorted by latest first
    const feedbacks = await Feedback.find({ hotelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json(
        new ApiResponse(200, "Feedbacks retrieved successfully", {
            feedbacks,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalRecords: total,
                limit: limitNum
            }
        })
    );
});

// Get recent feedbacks globally (top 10-20)
const getRecentFeedbacks = asyncHandler(async (req, res) => {
    const { limit = 15 } = req.query;

    // Convert to number and limit between 10-20
    const parsedLimit = Number.parseInt(limit, 10);
    const limitNum = Number.isNaN(parsedLimit) ? 15 : Math.max(10, Math.min(20, parsedLimit));

    // Fetch latest feedbacks globally sorted by creation date
    const feedbacks = await Feedback.find()
        .populate('hotelId', 'name city state')
        .sort({ createdAt: -1 })
        .limit(limitNum);

    if (!feedbacks) {
        throw new ApiError(500, "Failed to fetch recent feedbacks");
    }

    return res.status(200).json(
        new ApiResponse(200, "Recent feedbacks retrieved successfully", feedbacks)
    );
});

export { submitFeedback, getFeedbackByHotel, getRecentFeedbacks };
