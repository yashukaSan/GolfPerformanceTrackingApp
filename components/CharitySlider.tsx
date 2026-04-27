"use client";
import { useState } from "react";

interface CharitySliderProps {
  subscriptionPrice?: number; // Usually £9 or £79
}

export default function CharitySlider({
  subscriptionPrice = 9,
}: CharitySliderProps) {
  // PRD Section 08: 10% is the mandatory minimum floor
  const [percentage, setPercentage] = useState(15);

  // Logic to calculate the split (PRD Section 07/08)
  const donationAmount = (subscriptionPrice * (percentage / 100)).toFixed(2);
  const prizePoolContribution = (
    subscriptionPrice - parseFloat(donationAmount)
  ).toFixed(2);

  return (
    <div className="bg-ink2 p-8 rounded-3xl border border-border shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-syne text-xl font-bold">Your Impact</h3>
          <p className="text-[10px] text-muted2 uppercase tracking-widest mt-1">
            Min 10% Required
          </p>
        </div>
        <div className="text-right">
          <span className="font-syne text-3xl font-extrabold text-lime">
            {percentage}%
          </span>
        </div>
      </div>

      {/* The Interactive Slider */}
      <div className="relative h-12 flex items-center">
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={percentage}
          onChange={(e) => setPercentage(parseInt(e.target.value))}
          className="w-full appearance-none bg-ink h-2 rounded-full cursor-pointer accent-lime"
          style={{
            background: `linear-gradient(to right, var(--lime) 0%, var(--lime) ${percentage}%, var(--border) ${percentage}%, var(--border) 100%)`,
          }}
        />
      </div>

      <p className="text-[10px] text-center text-muted2 mb-8 mt-2 italic">
        Drag to give more — the sky's the limit ↑
      </p>

      {/* Financial Breakdown Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ink/50 p-4 rounded-2xl border border-border/50">
          <p className="text-[10px] text-muted2 uppercase font-bold mb-1">
            To Charity
          </p>
          <p className="font-syne text-xl font-bold text-white">
            £{donationAmount}
          </p>
        </div>
        <div className="bg-ink/50 p-4 rounded-2xl border border-border/50">
          <p className="text-[10px] text-muted2 uppercase font-bold mb-1">
            To Prize Pool
          </p>
          <p className="font-syne text-xl font-bold text-white">
            £{prizePoolContribution}
          </p>
        </div>
      </div>

      <button
        className="w-full mt-8 py-4 bg-white/5 hover:bg-lime hover:text-black border border-white/10 rounded-xl font-syne font-bold text-xs transition-all uppercase tracking-widest"
        onClick={() => alert(`Impact updated to ${percentage}%!`)}
      >
        Update Contribution
      </button>
    </div>
  );
}
