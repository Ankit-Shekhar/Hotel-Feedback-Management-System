import { Router } from "express";
import { getRecentFeedbacks, submitFeedback } from "../controllers/feedback.controller.js";
import { validateFeedback } from "../middlewares/validateFeedback.middleware.js";

const router = Router();

// Public: submit feedback
// Middleware chain: validate body -> apply 30-day feedback logic
router.route("/").post(validateFeedback, submitFeedback);

// Public: explicit global feedback endpoint (Rendezvous)
router.route("/global").post(validateFeedback, submitFeedback);

// Public: fetch latest feedback globally
router.route("/recent").get(getRecentFeedbacks);

export default router;
