/**
 * GreenDrop Payment Helpers
 */

// 1. Check if user has an active subscription
export async function getSubscriptionStatus(supabase, userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error || !data) return "inactive";

  // Returns 'active', 'lapsed', or 'cancelled' as per PRD Section 04
  return data.subscription_status;
}

// 2. Handle Stripe Webhook (Updates DB when payment is successful)
export async function handleWebhookEvent(event) {
  const session = event.data.object;
  const userId = session.metadata.userId;

  if (event.type === "checkout.session.completed") {
    // Update Supabase profile to 'active'
    await supabase
      .from("profiles")
      .update({
        subscription_status: "active",
        stripe_customer_id: session.customer,
      })
      .eq("id", userId);
  }
}
