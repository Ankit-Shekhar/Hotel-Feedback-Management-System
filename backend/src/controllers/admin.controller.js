import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { Hotel } from "../models/hotels.model.js";
import { Feedback } from "../models/feedbacks.model.js";
import { getCache, setCache, deleteCache } from "../utils/redis.js";
import jwt from "jsonwebtoken";

// Generate JWT token for admin
// we dont use "asyncHandler" here because this function is not a controller function, its just a utility function to generate tokens
const generateAdminToken = async (adminId) => {
    try {
        // finding the admin in DB on the basis of "adminId" and generating JWT token
        const admin = await Admin.findById(adminId);

        // generate token with admin id
        const token = jwt.sign(
            {
                _id: admin._id,
                username: admin.username
            },
            process.env.ADMIN_TOKEN_SECRET || "admin-secret-key",
            {
                expiresIn: process.env.ADMIN_TOKEN_EXPIRY || "7d"
            }
        );

        return token;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating admin token");
    }
};

// Login admin with credentials validation
const loginAdmin = asyncHandler(async (req, res) => {
    // LOGIC :: THAT HAS TO BE EXECUTED.
    // 1. get data from "req.body"
    // 2. validate username and password
    // 3. find the admin from DB
    // 4. check if provided password is correct using isPasswordCorrect method from admin model
    // 5. if correct password is given then generate "JWT Token"
    // 6. send JWT Token to admin through response
    // 7. give response (logged in)

    const { username, password } = req.body;

    // Validation: Check required fields
    if (!username || !username.trim()) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Find admin by username
    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    // Check if provided password is correct
    // we have already made a method "isPasswordCorrect" using "adminSchema.methods" in admin.model.js
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    // Generate JWT token
    const token = await generateAdminToken(admin._id);

    // Get admin data without password
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    // Cookie options for secure transmission
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    // Return response with token in cookie and body
    return res.status(200)
        .cookie("adminToken", token, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    token
                },
                "Admin logged in successfully"
            )
        );
});

// Get dashboard statistics with Redis caching
const getDashboardStats = asyncHandler(async (req, res) => {
    // LOGIC :: THAT HAS TO BE EXECUTED.
    // 1. Check Redis cache for "dashboard:stats"
    // 2. If exists → return cached data
    // 3. Else:
    //    - Count total hotels
    //    - Count total feedbacks
    //    - Calculate average ratings across all hotels
    // 4. Store in Redis cache (TTL: 10 min)
    // 5. Return response

    // Check Redis cache first
    const cachedStats = getCache("dashboard:stats");
    if (cachedStats) {
        return res.status(200).json(
            new ApiResponse(200, "Dashboard stats retrieved successfully", cachedStats)
        );
    }

    // Fetch data from MongoDB
    const totalHotels = await Hotel.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    // Calculate average ratings across all hotels
    const hotels = await Hotel.find().select("ratingsSummary");

    let averageOverall = 0;
    let averageFood = 0;
    let averageService = 0;
    let averageAmbience = 0;

    if (hotels.length > 0) {
        const sumOverall = hotels.reduce((sum, h) => sum + (h.ratingsSummary?.overall || 0), 0);
        const sumFood = hotels.reduce((sum, h) => sum + (h.ratingsSummary?.food || 0), 0);
        const sumService = hotels.reduce((sum, h) => sum + (h.ratingsSummary?.service || 0), 0);
        const sumAmbience = hotels.reduce((sum, h) => sum + (h.ratingsSummary?.ambience || 0), 0);

        averageOverall = parseFloat((sumOverall / hotels.length).toFixed(2));
        averageFood = parseFloat((sumFood / hotels.length).toFixed(2));
        averageService = parseFloat((sumService / hotels.length).toFixed(2));
        averageAmbience = parseFloat((sumAmbience / hotels.length).toFixed(2));
    }

    const stats = {
        totalHotels,
        totalFeedbacks,
        averageRatings: {
            overall: averageOverall,
            food: averageFood,
            service: averageService,
            ambience: averageAmbience
        }
    };

    // Store in Redis cache (TTL: 10 minutes)
    setCache("dashboard:stats", stats, 600);

    return res.status(200).json(
        new ApiResponse(200, "Dashboard stats retrieved successfully", stats)
    );
});

// Get hotel analytics
const getHotelAnalytics = asyncHandler(async (req, res) => {
    // LOGIC :: THAT HAS TO BE EXECUTED.
    // 1. Get hotelId from params
    // 2. Validate hotel exists
    // 3. Get hotel ratingsSummary and totalReviews
    // 4. Get recent feedbacks for that hotel (latest 10)
    // 5. Return all data in response

    const { hotelId } = req.params;

    if (!hotelId || !hotelId.trim()) {
        throw new ApiError(400, "Hotel ID is required");
    }

    // Fetch hotel details
    const hotel = await Hotel.findById(hotelId).select(
        "name city state ratingsSummary totalReviews"
    );

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // Fetch recent feedbacks for the hotel (latest 10)
    const recentFeedbacks = await Feedback.find({ hotelId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("userName contact ratings suggestion createdAt");

    // Construct analytics response
    const analytics = {
        hotel: {
            _id: hotel._id,
            name: hotel.name,
            city: hotel.city,
            state: hotel.state,
            ratingsSummary: hotel.ratingsSummary,
            totalReviews: hotel.totalReviews
        },
        recentFeedbacks: recentFeedbacks
    };

    return res.status(200).json(
        new ApiResponse(200, "Hotel analytics retrieved successfully", analytics)
    );
});

export { loginAdmin, getDashboardStats, getHotelAnalytics };
