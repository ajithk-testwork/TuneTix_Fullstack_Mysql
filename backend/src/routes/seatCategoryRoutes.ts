import express from "express";

import {
  createSeatCategory,
  getSeatCategories,
  updateSeatCategory,
  deleteSeatCategory,
} from "../controllers/SeatCategoryController";

import { protect } from "../middleware/authmiddleware";
import { adminOnly } from "../middleware/rolemiddleware";

const router = express.Router();


router.post( "/seat-category", protect, adminOnly, createSeatCategory);

router.get( "/seat-category/:eventId", getSeatCategories);

router.put( "/seat-category/:id", protect, adminOnly, updateSeatCategory);

router.delete( "/seat-category/:id", protect, adminOnly, deleteSeatCategory);

export default router;