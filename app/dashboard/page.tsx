"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScoreCard from "@/components/ScoreCard";
import PrizeGrid from "@/components/PrizeGrid";
import CharitySlider from "@/components/CharitySlider";
import { supabase } from "@/lib/supabase";

interface Score {
  score_value: number;
  score_date?: string;
  id?: string;
}

// ✅ FIX: Calculate the next 1st of the month dynamically instead of hardcoding "May 1st, 2024"
function getNextDrawDate(): string {
  const now = new Date();
  const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextDraw.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async (userId: string) => {
    const { data: scoresData } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("score_date", { ascending: false })
      .limit(5);
    setScores(scoresData || []);
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.replace("/login");
          return;
        }

        setUser(session.user);
        await fetchScores(session.user.id);
      } catch (err) {
        console.error("Dashboard error:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white">
        <div className="animate-pulse font-syne text-xl">Loading Hero Dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="p-8 max-w-6xl mx-auto text-white">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-syne text-4xl">Welcome back, Hero.</h1>
          <p className="text-muted2">
            Status: <span className="text-lime font-bold">Active Subscriber</span>
          </p>
          <p className="text-xs text-muted2 mt-1">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
          <div className="text-right">
            <p className="text-xs text-muted2">Next Draw</p>
            {/* ✅ FIX: Was hardcoded to "May 1st, 2024" — now computed dynamically */}
            <p className="font-bold">{getNextDrawDate()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Score Management */}
        <section>
          <ScoreCard
            existingScores={scores.map((s) => ({ value: s.score_value }))}
            onScoreAdded={() => user && fetchScores(user.id)}
          />
        </section>

        {/* Right Column: Charity Impact */}
        <section>
          <CharitySlider subscriptionPrice={9.0} />
        </section>
      </div>

      {/* Bottom Section: Prize Pools */}
      <section className="mt-16">
        <h2 className="font-syne text-2xl mb-6">Monthly Prize Tiers</h2>
        <PrizeGrid totalPool={12500} isRollover={true} />
      </section>
    </main>
  );
}
