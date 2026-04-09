import { ApiError } from "../utils/ApiErrors.js";

// validateFeedback: Validate feedback request body
// Rules:
// - All rating fields (overall, food, service, ambience) must exist
// - All ratings must be between 1-5
// - suggestion must be string and max 500 characters
// - contact must exist
export const validateFeedback = (req, res, next) => {
    try {
        const { hotelId, userName, contact, ratings, suggestion } = req.body;

        // Check if ratings object exists
        if (!ratings || typeof ratings !== "object") {
            throw new ApiError(400, "Ratings object is required");
        }

        // Check if all rating fields exist
        if (
            !("overall" in ratings) ||
            !("food" in ratings) ||
            !("service" in ratings) ||
            !("ambience" in ratings)
        ) {
            throw new ApiError(
                400,
                "All rating fields (overall, food, service, ambience) are required"
            );
        }

        // Validate each rating is between 1-5
        const ratingValues = [ratings.overall, ratings.food, ratings.service, ratings.ambience];
        if (!ratingValues.every((val) => val >= 1 && val <= 5)) {
            throw new ApiError(400, "All ratings must be between 1 and 5");
        }

        // Check contact exists
        if (!contact || !contact.trim()) {
            throw new ApiError(400, "Contact is required");
        }

        // Check suggestion exists
        if (!suggestion) {
            throw new ApiError(400, "Suggestion is required");
        }

        // Check suggestion is string
        if (typeof suggestion !== "string") {
            throw new ApiError(400, "Suggestion must be a string");
        }

        // Check suggestion max length
        if (suggestion.length > 500) {
            throw new ApiError(400, "Suggestion must not exceed 500 characters");
        }

        // Check userName exists
        if (!userName || !userName.trim()) {
            throw new ApiError(400, "User name is required");
        }

        // Check hotelId exists
        if (!hotelId || !hotelId.trim()) {
            throw new ApiError(400, "Hotel ID is required");
        }

        // All validations passed, move to next middleware
        next();
    } catch (error) {
        next(error);
    }
};
