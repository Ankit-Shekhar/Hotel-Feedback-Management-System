import { Router } from "express";
import { addHotel, getAllHotels, getHotelById } from "../controllers/hotel.controller.js";
import { authMiddleware } from "../middlewares/authAdmin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public: fetch all hotels
// Protected (Admin): add a hotel
router.route("/").get(getAllHotels).post(authMiddleware, upload.single("photo"), addHotel);

// Public: fetch one hotel by id
router.route("/:id").get(getHotelById);

export default router;
