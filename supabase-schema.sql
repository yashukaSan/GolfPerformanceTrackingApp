-- 1. EXTENSIONS (For UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (PRD Section 03 & 04)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'lapsed', 'inactive', 'cancelled')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  stripe_customer_id TEXT,
  selected_charity_id UUID,
  charity_contribution_pct INT DEFAULT 10 CHECK (charity_contribution_pct >= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHARITIES TABLE (PRD Section 08)
CREATE TABLE charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  total_raised DECIMAL(12,2) DEFAULT 0.00,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SCORES TABLE (PRD Section 05 & 13)
CREATE TABLE scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  score_value INT NOT NULL CHECK (score_value >= 1 AND score_value <= 45),
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Section 13: Technical Constraint - One entry per date
  UNIQUE(user_id, score_date)
);

-- 5. DRAW RESULTS TABLE (PRD Section 06 & 07)
CREATE TABLE draw_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_date DATE DEFAULT CURRENT_DATE,
  winning_numbers INT[] NOT NULL, -- Array of 5 numbers
  total_pool DECIMAL(12,2),
  jackpot_won BOOLEAN DEFAULT false,
  rollover_amount DECIMAL(12,2) DEFAULT 0.00
);

-- 6. SECURITY: ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view/edit their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Scores: Users can view/insert their own scores
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. FUNCTION: INCREMENT CHARITY TOTAL
CREATE OR REPLACE FUNCTION increment_charity_total(charity_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE charities
  SET total_raised = total_raised + amount
  WHERE id = charity_id;
END;
$$ LANGUAGE plpgsql;
