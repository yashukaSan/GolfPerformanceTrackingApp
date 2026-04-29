import { supabase } from "@/lib/supabase"; // ✅ FIX: was missing entirely — caused ReferenceError at runtime

export async function verifyWinnerProof(winnerId, status) {
  // PRD Requirement: Admin Review Approve or Reject
  const { data, error } = await supabase
    .from("draw_entries")
    .update({ payment_status: status }) // Status: Pending -> Paid (Section 09)
    .eq("id", winnerId);

  return { data, error };
}

export async function getDrawStats() {
  // PRD Requirement: Reports & Analytics (Total users, total prize pool)
  const { data: users } = await supabase.from("profiles").select("count");
  const { data: pool } = await supabase
    .from("prize_pools")
    .select("amount")
    .single();

  return { totalUsers: users, currentPool: pool };
}

// ✅ NEW: Fetch pending winners from draw_entries table
export async function getPendingWinners() {
  const { data, error } = await supabase
    .from("draw_entries")
    .select("id, user_id, tier, proof_url, payment_status, profiles(email)")
    .eq("payment_status", "PENDING");

  if (error) {
    console.error("Error fetching pending winners:", error);
    return [];
  }

  return (data || []).map((entry) => ({
    id: entry.id,
    name: entry.profiles?.email || entry.user_id,
    tier: entry.tier,
    proofUrl: entry.proof_url,
    status: entry.payment_status,
  }));
}
