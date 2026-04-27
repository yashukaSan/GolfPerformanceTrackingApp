"use client";
import { useState } from "react";

interface ScoreCardProps {
    existingScores: { value: number }[];
    onScoreAdded: () => void;
}

export default function ScoreCard({ existingScores, onScoreAdded }: ScoreCardProps) {
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const val = parseInt(newScore);

    // PRD Section 05: Enforce 1-45 range
    if (isNaN(val) || val < 1 || val > 45) {
      alert("Please enter a valid Stableford score (1-45)");
      return;
    }

    setLoading(true);
    // Call the rolling logic API we created earlier
    const res = await fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ scoreValue: val }),
    });

    if (res.ok) {
      setNewScore("");
      onScoreAdded(); // Refresh the list
    } else {
      // PRD Section 13: Handle "One score per date" error
      alert("You have already submitted a score for today.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-ink2 p-6 rounded-lg border border-border">
      <h3 className="font-syne mb-6">
        Enter Today&apos;s Score
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="number"
          placeholder="1-45"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          className="flex-1 px-3 py-2 bg-ink border border-border rounded text-white placeholder-muted2"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "..." : "Add Score"}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-muted2 text-xs mb-4 uppercase">
          LATEST 5 ROLLING SCORES (SECTION 05)
        </p>
        <div className="flex gap-2">
          {existingScores.map((s, i) => (
            <div
              key={i}
              className={`px-4 py-2.5 rounded-lg font-bold ${
                s.value >= 36 ? "bg-lime text-black" : "bg-white/10 text-white"
              }`}
            >
              {s.value}
            </div>
          ))}
          {/* Fill empty slots if less than 5 scores exist */}
          {[...Array(Math.max(0, 5 - existingScores.length))].map((_, i) => (
            <div
              key={i}
              className="px-4 py-2.5 border border-border rounded-lg text-muted2"
            >
              -
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
