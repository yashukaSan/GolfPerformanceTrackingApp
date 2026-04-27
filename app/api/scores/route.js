import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export async function POST(req) {
  const { userId, scoreValue, scoreDate } = await req.json();

  // 1. Validation (PRD Section 05)
  if (scoreValue < 1 || scoreValue > 45) {
    return new Response("Score must be 1-45", { status: 400 });
  }

  // 2. Fetch existing scores for this user
  const { data: existingScores } = await supabase
    .from("scores")
    .select("id, score_date")
    .eq("user_id", userId)
    .order("score_date", { ascending: true }); // Oldest first

  // 3. Rolling Logic (Section 05: Only latest 5 retained)
  if (existingScores.length >= 5) {
    const oldestScoreId = existingScores[0].id;
    await supabase.from("scores").delete().eq("id", oldestScoreId);
  }

  // 4. Insert New Score
  const { error } = await supabase
    .from("scores")
    .insert([
      { user_id: userId, score_value: scoreValue, score_date: scoreDate },
    ]);

  if (error) return new Response(error.message, { status: 400 });

  return new Response("Score added successfully", { status: 200 });
}
