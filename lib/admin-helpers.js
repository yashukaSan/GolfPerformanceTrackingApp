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
