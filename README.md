# GreenDrop | Digital Heroes Platform

**GreenDrop** is a modern, emotion-driven platform designed to disrupt traditional golf performance tracking by integrating a monthly prize draw and charitable impact engine.

## 🚀 Tech Stack
- **Framework:** Next.js 16.2.4 (App Router)
- **Language:** TypeScript 5.8
- **Authentication:** Supabase SSR (Cookie-based)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe API (Subscription Engine)
- **Styling:** Tailwind CSS + Custom CSS Variables (Ink & Lime System)

## 🛠️ Requirements Satisfaction (PRD Compliance)
- **§04 Subscription:** Implements £9/mo and £79/yr tiers with real-time status validation.
- **§05 Score Management:** Features a rolling 5-score logic (1–45 Stableford) with automatic replacement.
- **§06 Draw Engine:** Algorithmic matching for 3, 4, and 5 numbers with jackpot rollover logic.
- **§08 Charity System:** Enforces a mandatory 10% contribution floor with an interactive impact slider.
- **§11 Admin Dashboard:** Includes winner verification (Proof/Screenshot review) and draw simulations.
- **§14 Aesthetic:** Strictly adheres to the "Digital-First" look; zero golf clichés (no grass/clubs).

## ⚙️ Installation & Setup

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root and add:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_MONTHLY_PRICE_ID=price_...
   STRIPE_YEARLY_PRICE_ID=price_...
   ```

3. **Database Setup:**
   - Run the provided `supabase-schema.sql` in your Supabase SQL Editor.
   - Enable **Email/Password** authentication in the Supabase Dashboard.

4. **Run Locally:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `/app`: Frontend pages and API routes.
- `/components`: Reusable UI widgets (ScoreCard, CharitySlider, etc.).
- `/lib`: Core logic engines (Draw algo, Stripe helpers, Supabase client).
- `/middleware.ts`: JWT/Session-based route protection.

## 📄 License
Created for the **Digital Heroes** Technical Evaluation.
