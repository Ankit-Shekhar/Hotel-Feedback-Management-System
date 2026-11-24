import { Router } from "express";
import { getFeedbackByHotel, getRecentFeedbacks, submitFeedback } from "../controllers/feedback.controller.js";
import { checkHotelExists } from "../middlewares/checkHotelExists.middleware.js";
import { validateFeedback } from "../middlewares/validateFeedback.middleware.js";

const router = Router();

// Public: submit feedback
// Middleware chain: validate body -> ensure hotel exists -> apply 30-day feedback logic
router.route("/").post(validateFeedback, checkHotelExists, submitFeedback);

// Public: list feedback for one hotel with pagination
router.route("/hotel/:hotelId").get(getFeedbackByHotel);

// Public: fetch latest feedback globally
router.route("/recent").get(getRecentFeedbacks);

export default router;
