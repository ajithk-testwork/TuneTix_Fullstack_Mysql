import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

const stripe: Stripe = new Stripe(stripeSecretKey);

export default stripe;