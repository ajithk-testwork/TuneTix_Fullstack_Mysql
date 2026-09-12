import express from "express";
import { protect } from "../middleware/authmiddleware";
import { adminOnly } from "../middleware/rolemiddleware";
import { upload } from "../config/uploads";
import {
  createEvent,
  deleteEvent,
  getAdminEventDetails,
  getAdminEvents,
  getAllEvents,
  getSingleEvent,
  publishEvent,
  unpublishEvent,
  updateEvent,
} from "../controllers/EventController";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User Profile",
  });
});

router.post("/event/create-event", protect, adminOnly, upload.single("image"), createEvent);
router.get("/admin/events", protect, adminOnly, getAdminEvents);
router.get("/admin/events/:id/details", protect, adminOnly, getAdminEventDetails)
router.get("/event/:id", getSingleEvent);
router.put("/events/:id", protect, adminOnly, upload.single("image"), updateEvent);
router.delete("/event/:id", protect, adminOnly, deleteEvent);
router.patch("/events/:id/publish", protect, adminOnly, publishEvent);
router.patch("/events/:id/unpublish", protect, adminOnly, unpublishEvent);

export default router;
