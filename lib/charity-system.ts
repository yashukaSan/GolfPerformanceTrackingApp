/**
 * GreenDrop Charity System
 * Handles contribution logic, directory filtering, and impact tracking
 */

import { SupabaseClient } from '@supabase/supabase-js';

// 1. Contribution Calculator (PRD Section 08)
export function calculateCharityCut(subscriptionAmount: number, userSelectedPct: number = 10) {
  // Ensure the percentage never drops below the 10% minimum requirement
  const finalPct = Math.max(10, userSelectedPct);

  const contribution = (subscriptionAmount * (finalPct / 100)).toFixed(2);
  const remainingPool = (subscriptionAmount - parseFloat(contribution)).toFixed(2);

  return {
    donationAmount: parseFloat(contribution),
    platformAndPrizePool: parseFloat(remainingPool),
    percentage: finalPct,
  };
}

// 2. Directory Features (PRD Section 08)
export async function getCharityDirectory(supabase: SupabaseClient, filter: string = "") {
  let query = supabase
    .from("charities")
    .select("*")
    .order("name", { ascending: true });

  if (filter) {
    query = query.ilike("name", `%${filter}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// 3. Impact Tracking Logic
export async function updateCharityTotal(supabase: SupabaseClient, charityId: string, amount: number) {
  // Increments the total raised for a specific charity
  const { data, error } = await supabase.rpc("increment_charity_total", {
    charity_row_id: charityId,
    increment_by: amount,
  });

  return { data, error };
}
