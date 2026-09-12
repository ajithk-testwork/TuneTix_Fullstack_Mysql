import express from "express";

import { cancelBooking, createBooking, getBookingById, getMyBookings } from "../controllers/BookingController";

import { protect } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/booking", protect, createBooking);
router.get("/booking/my",protect, getMyBookings);
router.get("/booking/:bookingId",protect, getBookingById);
router.put("/booking/cancel/:bookingId", protect, cancelBooking);

export default router;
