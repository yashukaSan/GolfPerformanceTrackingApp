"use client";

export default function PrizeGrid({ totalPool = 10000, isRollover = false }) {
  // PRD Section 07: 40/35/25% Split
  const tiers = [
    {
      match: "5 Numbers",
      label: "The Hero Jackpot",
      percent: "40%",
      amount: (totalPool * 0.4).toLocaleString(),
      color: "var(--lime)",
      badge: isRollover ? "ROLLOVER ACTIVE" : "TOP TIER",
    },
    {
      match: "4 Numbers",
      label: "Pro Tier",
      percent: "35%",
      amount: (totalPool * 0.35).toLocaleString(),
      color: "var(--teal)",
      badge: null,
    },
    {
      match: "3 Numbers",
      label: "Starter Tier",
      percent: "25%",
      amount: (totalPool * 0.25).toLocaleString(),
      color: "var(--white)",
      badge: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className={`bg-ink2 p-6 rounded-lg border relative overflow-hidden ${
            index === 0 ? "border-lime" : "border-border"
          }`}
        >
          {tier.badge && (
            <div className="absolute top-2.5 -right-8 bg-lime text-black px-10 py-1 rotate-45 text-xs font-bold">
              {tier.badge}
            </div>
          )}

          <p className="text-muted2 text-xs uppercase">
            {tier.match}
          </p>
          <h3 className="font-syne text-xl my-3">
            {tier.label}
          </h3>

          <div className="mt-6">
            <span
              className={`text-3xl font-bold`}
              style={{ color: tier.color }}
            >
              £{tier.amount}
            </span>
            <span className="text-muted2 ml-3">
              ({tier.percent} Pool)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
