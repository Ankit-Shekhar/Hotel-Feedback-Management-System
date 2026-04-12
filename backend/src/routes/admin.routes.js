import { Router } from "express";
import {
	deleteAllFeedbacks,
	deleteFeedbacksBulk,
	getDashboardStats,
	loginAdmin
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/authAdmin.middleware.js";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin.middleware.js";

const router = Router();

// Public: admin login
router.route("/login").post(loginAdmin);

// Protected (Admin): dashboard aggregate stats
router.route("/dashboard").get(authMiddleware, getDashboardStats);

// Protected (Super Admin): delete selected feedbacks permanently
router.route("/feedback/delete-bulk").post(authMiddleware, requireSuperAdmin, deleteFeedbacksBulk);

// Protected (Super Admin): delete all feedbacks permanently
router.route("/feedback/delete-all").post(authMiddleware, requireSuperAdmin, deleteAllFeedbacks);

export default router;
