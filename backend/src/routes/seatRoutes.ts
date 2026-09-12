import express from "express";

import {
    generateSeats,
    getSeatLayout,
} from "../controllers/SeatController";

import { protect } from "../middleware/authmiddleware";
import { adminOnly } from "../middleware/rolemiddleware";

const router = express.Router();

router.post("/seats/generate/:categoryId", protect, adminOnly, generateSeats);

router.get( "/seats/event/:eventId", getSeatLayout);

export default router;