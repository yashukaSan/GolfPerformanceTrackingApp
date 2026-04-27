import Stripe from "stripe";

/**
 * GreenDrop Stripe Utility
 * Handles server-side payment initialization
 */

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10", // Ensures stable API versioning
});

/**
 * Validates a Stripe Customer's status
 * Satisfies the "Real-time status check" requirement
 */
export async function verifyStripeSubscription(customerId: string) {
  if (!customerId) return "inactive";

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    return subscriptions.data.length > 0 ? "active" : "lapsed";
  } catch (error) {
    console.error("Stripe verification error:", error);
    return "inactive";
  }
}

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: process.env.STRIPE_MONTHLY_PRICE_ID!,
    name: "Monthly Hero",
    unit_amount: 900, // Correct: 900 pence
    currency: "gbp",
    interval: "month",
  },
  YEARLY: {
    id: process.env.STRIPE_YEARLY_PRICE_ID!,
    name: "Annual Legend",
    unit_amount: 7900, // Correct: 7900 pence
    currency: "gbp",
    interval: "year",
  },
};
  