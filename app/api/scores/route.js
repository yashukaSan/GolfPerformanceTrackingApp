import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ✅ FIX: Use the SSR server client so we can read the user session server-side.
// Original used `createClient` with unauthenticated env vars and relied on the
// client passing `userId` in the request body — a security hole (anyone could
// forge a userId). We now pull the userId from the verified session cookie.

export async function POST(req) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 1. Authenticate: get user from session (can't be forged by client)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Parse body — client only needs to send scoreValue
  const body = await req.json();
  const { scoreValue } = body;

  // ✅ FIX: scoreDate was undefined in original (never passed by client).
  // We derive it server-side from the current timestamp.
  const scoreDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // 3. Validation (PRD Section 05)
  const val = parseInt(scoreValue);
  if (isNaN(val) || val < 1 || val > 45) {
    return NextResponse.json({ error: "Score must be between 1 and 45" }, { status: 400 });
  }

  // 4. One score per day enforcement (PRD Section 13)
  const { data: todayScore } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", userId)
    .eq("score_date", scoreDate)
    .single();

  if (todayScore) {
    return NextResponse.json(
      { error: "You have already submitted a score for today." },
      { status: 409 }
    );
  }

  // 5. Fetch existing scores for rolling logic
  const { data: existingScores } = await supabase
    .from("scores")
    .select("id, score_date")
    .eq("user_id", userId)
    .order("score_date", { ascending: true }); // Oldest first

  // 6. Rolling Logic (Section 05: Only latest 5 retained)
  if (existingScores && existingScores.length >= 5) {
    const oldestScoreId = existingScores[0].id;
    await supabase.from("scores").delete().eq("id", oldestScoreId);
  }

  // 7. Insert New Score
  const { error } = await supabase.from("scores").insert([
    { user_id: userId, score_value: val, score_date: scoreDate },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
