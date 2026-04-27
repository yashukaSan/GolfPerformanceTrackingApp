"use client";

interface Score {
  score_value: number;
  score_date?: string;
  id?: string;
}

interface ScoreCardProps {
  existingScores: { value: number }[];
  onScoreAdded: () => void;
}
  
import { useEffect, useState } from "react";
import ScoreCard from "@/components/ScoreCard";
import PrizeGrid from "@/components/PrizeGrid";
import CharitySlider from "@/components/CharitySlider";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data and scores on mount
  useEffect(() => {
    const getDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("scores")
          .select("*")
          .eq("user_id", user.id)
          .order("score_date", { ascending: false })
          .limit(5);
        setScores(data || []);
      }
      setLoading(false);
    };
    getDashboardData();
  }, []);

  if (loading)
    return <div className="text-center p-4 text-white">Loading Hero Dashboard...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto text-white">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-syne text-4xl">
            Welcome back, Hero.
          </h1>
          <p className="text-muted2">
            Status:{" "}
            <span className="text-lime font-bold">Active Subscriber</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted2">
            Next Draw
          </p>
          <p className="font-bold">May 1st, 2024</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Score Management */}
        <section>
          <ScoreCard
            existingScores={scores.map((s) => ({ value: s.score_value }))}
            onScoreAdded={() => window.location.reload()} // Simplified refresh
          />
        </section>

        {/* Right Column: Charity Impact */}
        <section>
          <CharitySlider subscriptionPrice={9.0} />
        </section>
      </div>

      {/* Bottom Section: Prize Pools */}
      <section className="mt-16">
        <h2 className="font-syne mb-6">
          Monthly Prize Tiers
        </h2>
        <PrizeGrid totalPool={12500} isRollover={true} />
      </section>
    </main>
  );
}
