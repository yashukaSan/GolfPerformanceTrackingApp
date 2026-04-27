"use client";
import { useState } from "react";
import CharitySlider from "@/components/CharitySlider";

export default function CharityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // PRD Section 08: Mock directory data
  const charities = [
    {
      name: "Macmillan",
      desc: "Specialist health care and financial support.",
      raised: "£24,500",
      color: "var(--lime)",
    },
    {
      name: "Age UK",
      desc: "Supporting older people to live well and independently.",
      raised: "£12,340",
      color: "var(--teal)",
    },
    {
      name: "Mind",
      desc: "Mental health support, advice and emergency help.",
      raised: "£18,120",
      color: "var(--white)",
    },
    {
      name: "Cancer Research",
      desc: "Pioneering work to prevent and cure cancer.",
      raised: "£31,000",
      color: "var(--lime)",
    },
  ];

  const filteredCharities = charities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="bg-ink min-h-screen text-white pb-20">
      {/* Hero Header */}
      <section className="py-20 px-8 border-b border-border bg-ink2/50">
        <div className="max-w-6xl mx-auto">
          <span className="text-lime font-syne text-xs tracking-widest uppercase">
            Charity First
          </span>
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold mt-4 mb-6">
            Your game.
            <br />
            Real impact.
          </h1>
          <p className="text-muted2 max-w-xl text-lg">
            Every subscription contributes to a cause you care about. Choose
            your partner and decide your level of impact.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Left Column: Directory & Search */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Find your charity..."
              className="w-full bg-ink2 border border-border p-4 rounded-lg focus:border-lime outline-none transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCharities.map((charity, i) => (
              <div
                key={i}
                className="p-8 bg-ink2 border border-border rounded-2xl hover:border-lime transition-all cursor-pointer group"
              >
                <h3 className="font-syne text-xl mb-2 group-hover:text-lime">
                  {charity.name}
                </h3>
                <p className="text-muted2 text-sm mb-6 leading-relaxed">
                  {charity.desc}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-muted2 uppercase tracking-tighter">
                      Raised this month
                    </p>
                    <p
                      className="text-2xl font-bold font-syne"
                      style={{ color: charity.color }}
                    >
                      {charity.raised}
                    </p>
                  </div>
                  <button className="text-xs font-bold border-b border-white hover:border-lime hover:text-lime pb-1">
                    Select Cause
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Impact Tool */}
        <aside className="space-y-8">
          <div className="p-8 bg-lime text-black rounded-2xl">
            <h4 className="font-syne text-2xl font-bold mb-2">£2,340</h4>
            <p className="text-sm font-medium opacity-80">
              Total Community Impact <br />
              This Month
            </p>
          </div>

          {/* Reusing the CharitySlider component from our library */}
          <div className="p-1 bg-gradient-to-b from-border to-transparent rounded-2xl">
            <div className="bg-ink2 p-8 rounded-2xl">
              <CharitySlider subscriptionPrice={9.0} />
              <p className="text-[10px] text-center text-muted2 mt-6 leading-tight">
                *A minimum of 10% is mandatory per Digital Heroes PRD Section
                08.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
