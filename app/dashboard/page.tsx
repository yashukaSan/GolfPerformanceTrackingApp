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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Get the session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.log("Dashboard: No active session found, redirecting...");
          router.replace("/login");
          return;
        }

        // 2. Set user info
        setUser(session.user);

        // 3. Fetch scores
        const { data: scoresData } = await supabase
          .from("scores")
          .select("*")
          .eq("user_id", session.user.id)
          .order("score_date", { ascending: false })
          .limit(5);

        setScores(scoresData || []);
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

  // While checking auth, show a neutral loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white">
        <div className="animate-pulse font-syne text-xl">
          Loading Hero Dashboard...
        </div>
      </div>
    );
  }

  // If loading finished and user is still null, don't render anything (redirecting)
  if (!user) return null;

  return (
    <main className="p-8 max-w-6xl mx-auto text-white">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-syne text-4xl">Welcome back, Hero.</h1>
          <p className="text-muted2">
            Status:{" "}
            <span className="text-lime font-bold">Active Subscriber</span>
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
            <p className="font-bold">May 1st, 2024</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Score Management */}
        <section>
          <ScoreCard
            existingScores={scores.map((s) => ({ value: s.score_value }))}
            onScoreAdded={() => window.location.reload()}
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
