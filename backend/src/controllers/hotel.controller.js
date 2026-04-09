import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Hotel } from "../models/hotel.model.js";
import { getCache, setCache, deleteCache } from "../utils/cache.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Fetch all hotels with caching
const getAllHotels = asyncHandler(async (req, res) => {
    // Check Redis cache first
    const cachedHotels = getCache("hotels:all");
    if (cachedHotels) {
        return res.status(200).json(
            new ApiResponse(200, "Success", cachedHotels)
        );
    }

    // Fetch from MongoDB
    const hotels = await Hotel.find().select(
        "name city state photoUrl photoPublicId ratingsSummary totalReviews"
    );

    if (!hotels) {
        throw new ApiError(500, "Failed to fetch hotels");
    }

    // Store in Redis cache (TTL: 10 minutes)
    setCache("hotels:all", hotels, 600);

    return res.status(200).json(
        new ApiResponse(200, "Success", hotels)
    );
});

// Fetch single hotel by ID with caching
const getHotelById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Hotel ID is required");
    }

    // Check Redis cache for this specific hotel
    const cacheKey = `hotel:${id}`;
    const cachedHotel = getCache(cacheKey);
    if (cachedHotel) {
        return res.status(200).json(
            new ApiResponse(200, "Success", cachedHotel)
        );
    }

    // Fetch from MongoDB
    const hotel = await Hotel.findById(id).select("name city state photoUrl photoPublicId ratingsSummary totalReviews");

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    // Store in Redis cache (TTL: 10 minutes)
    setCache(cacheKey, hotel, 600);

    return res.status(200).json(
        new ApiResponse(200, "Success", hotel)
    );
});

// Add new hotel (Admin Only)
const addHotel = asyncHandler(async (req, res) => {
    const { name, city, state } = req.body;

    // Validation: Check required fields
    if (!name || !name.trim()) {
        throw new ApiError(400, "Hotel name is required");
    }

    if (!city || !city.trim()) {
        throw new ApiError(400, "City is required");
    }

    if (!state || !state.trim()) {
        throw new ApiError(400, "State is required");
    }

    // Check if hotel with same name already exists (unique constraint)
    const existingHotel = await Hotel.findOne({ name: name.trim() });
    if (existingHotel) {
        throw new ApiError(409, "Hotel with this name already exists");
    }

    if (!req.file?.path) {
        throw new ApiError(400, "Hotel photo is required");
    }

    const uploadedPhoto = await uploadOnCloudinary(req.file.path);

    if (!uploadedPhoto?.secure_url && !uploadedPhoto?.url) {
        throw new ApiError(500, "Failed to upload hotel photo");
    }

    // Create new hotel
    const hotel = await Hotel.create({
        name: name.trim(),
        city: city.trim(),
        state: state.trim(),
        photoUrl: uploadedPhoto.secure_url || uploadedPhoto.url,
        photoPublicId: uploadedPhoto.public_id,
        ratingsSummary: {
            overall: 0,
            food: 0,
            service: 0,
            ambience: 0
        },
        totalReviews: 0
    });

    if (!hotel) {
        throw new ApiError(500, "Failed to add hotel");
    }

    // Clear the hotels cache after adding new hotel
    deleteCache("hotels:all");

    return res.status(201).json(
        new ApiResponse(201, "Success", hotel)
    );
});

export { getAllHotels, getHotelById, addHotel };
