import express from "express";

import { cancelBooking, checkInTicket, createBooking, getBookingById, getMyBookings } from "../controllers/BookingController";

import { protect } from "../middleware/authmiddleware";
import { adminOnly } from "../middleware/rolemiddleware";

const router = express.Router();

router.post("/booking", protect, createBooking);
router.get("/booking/my",protect, getMyBookings);
router.get("/booking/:bookingId",protect, getBookingById);
router.put("/booking/cancel/:bookingId", protect, cancelBooking);
router.post("/booking/check-in", protect, adminOnly, checkInTicket)

export default router;
