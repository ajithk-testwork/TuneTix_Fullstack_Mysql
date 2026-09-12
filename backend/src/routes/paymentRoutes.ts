import express from "express";

import { protect } from "../middleware/authmiddleware";

import { createCheckoutSession, paymentCancel, paymentSuccess } from "../controllers/PaymentController";

import { stripeWebhook } from "../controllers/WebhookController";

const router = express.Router();

/* Stripe Webhook */
router.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

/* Create Checkout Session */
router.post("/payment/create-checkout-session", protect, createCheckoutSession);

router.post("/payment/success", protect, paymentSuccess);

router.post("/payment/cancel", protect, paymentCancel);

export default router;
