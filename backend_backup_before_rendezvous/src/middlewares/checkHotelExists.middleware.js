import { ApiError } from "../utils/ApiErrors.js";
import { Hotel } from "../models/hotel.model.js";

// checkHotelExists: Validate hotelId exists in database before controller execution
// Get hotelId from params or body and verify it exists in DB
export const checkHotelExists = async (req, res, next) => {
    try {
        // Get hotelId from params or body
        const hotelId = req.params.hotelId || req.body.hotelId;

        if (!hotelId || !hotelId.trim()) {
            throw new ApiError(400, "Hotel ID is required");
        }

        // Check if hotel exists in database
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            throw new ApiError(404, "Hotel not found");
        }

        // Attach hotel to request object for use in controllers
        req.hotel = hotel;
        next();
    } catch (error) {
        next(error);
    }
};
