"use client";

import Link from "next/link";

export default function LandingPage() {
  // PRD Section 04: Pricing strictly defined as £9 and £79
  const pricing = {
    monthly: 9,
    yearly: 79,
  };

  return (
    <div className="bg-ink text-white min-h-screen">
      {/* Hero Section - PRD Section 02 & 14 */}
      <section
        className="py-32 px-8 text-center"
        style={{
          background:
            "radial-gradient(circle at center, var(--ink2) 0%, var(--ink) 100%)",
        }}
      >
        <h1 className="font-syne text-5xl md:text-7xl font-extrabold leading-tight">
          BE THE <span className="text-lime">HERO</span> <br />
          OF YOUR GAME.
        </h1>
        <p className="text-muted2 max-w-2xl mx-auto my-8 text-xl">
          The modern platform where your golf performance fuels charitable
          impact. Win big, give back, and track your progress.
        </p>
        <div className="flex gap-4 justify-center mt-12">
          <Link href="/signup" className="px-10 py-4 no-underline btn-primary">
            Join the Draw
          </Link>
          <Link href="#plans" className="px-10 py-4 no-underline btn-ghost">
            View Plans
          </Link>
        </div>
      </section>

      {/* Subscription Plans - PRD Section 04 */}
      <section id="plans" className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="font-syne text-center mb-16">
          Simple, Impactful Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="border border-border text-center p-12 bg-ink2">
            <h3 className="font-syne">Monthly Hero</h3>
            <div className="text-6xl font-bold my-6">
              £{pricing.monthly}
              <span className="text-sm text-muted2">/mo</span>
            </div>
            <ul className="list-none p-0 text-muted2 mb-8 text-left">
              <li className="mb-2">✓ Monthly Prize Draw Entry</li>
              <li className="mb-2">✓ Rolling 5 Score Tracking</li>
              <li className="mb-2">✓ 10% Min. Charity Donation</li>
            </ul>
            <Link
              href="/signup?plan=monthly"
              className="block no-underline btn-primary"
            >
              Get Started
            </Link>
          </div>

          {/* Yearly Plan - Best Value */}
          <div className="border-2 border-lime text-center p-12 bg-ink2 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-lime text-black px-3 py-1 rounded text-xs font-bold">
              BEST VALUE
            </div>
            <h3 className="font-syne">Annual Legend</h3>
            <div className="text-6xl font-bold my-6">
              £{pricing.yearly}
              <span className="text-sm text-muted2">/yr</span>
            </div>
            <ul className="list-none p-0 text-muted2 mb-8 text-left">
              <li className="mb-2">✓ All Monthly Features</li>
              <li className="mb-2">✓ Save £29 per year</li>
              <li className="mb-2">✓ Exclusive Annual Reports</li>
            </ul>
            <Link
              href="/signup?plan=yearly"
              className="block no-underline btn-primary"
            >
              Join Annually
            </Link>
          </div>
        </div>
      </section>
      {/* Charity Spotlight - PRD Section 08 */}
      <section className="py-20 px-8 bg-ink2 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-syne mb-6">Drive Change with Every Score</h2>
          <p className="text-muted2 mb-12">
            A minimum of 10% of your subscription goes directly to our partner
            charities. Track your personal impact as you play.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            {/* Add 4 charity logos or placeholder names here */}
            <div className="font-bold">MACMILLAN</div>
            <div className="font-bold">CANCER RESEARCH</div>
            <div className="font-bold">MIND</div>
            <div className="font-bold">BHF</div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown - PRD Section 05 & 06 */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-lime text-3xl mb-4">01</div>
            <h4 className="font-syne mb-2">Input Scores</h4>
            <p className="text-muted2 text-sm">
              Submit your latest Stableford scores (1-45). We keep your best
              rolling 5.
            </p>
          </div>
          <div>
            <div className="text-lime text-3xl mb-4">02</div>
            <h4 className="font-syne mb-2">The Draw</h4>
            <p className="text-muted2 text-sm">
              Our monthly algorithmic draw picks 5 numbers. Match 3, 4, or 5 to
              win.
            </p>
          </div>
          <div>
            <div className="text-lime text-3xl mb-4">03</div>
            <h4 className="font-syne mb-2">Earn Rewards</h4>
            <p className="text-muted2 text-sm">
              Win your share of the pool. If the Jackpot isn't hit, it rolls
              over.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
