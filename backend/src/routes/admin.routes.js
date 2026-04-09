import { Router } from "express";
import { getDashboardStats, getHotelAnalytics, loginAdmin } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/authAdmin.middleware.js";

const router = Router();

// Public: admin login
router.route("/login").post(loginAdmin);

// Protected (Admin): dashboard aggregate stats
router.route("/dashboard").get(authMiddleware, getDashboardStats);

// Protected (Admin): analytics for a specific hotel
router.route("/analytics/:hotelId").get(authMiddleware, getHotelAnalytics);

export default router;
