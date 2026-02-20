-- ═══════════════════════════════════════════════════════════════
-- VEGAERP Placement System — Supabase Tables Setup
-- Run this in your Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. PLACEMENTS TABLE (TPO posts drives here)
CREATE TABLE IF NOT EXISTS placements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  package_lpa NUMERIC NOT NULL,
  deadline    DATE,
  drive_date  DATE,
  description TEXT,
  eligibility TEXT,
  type        TEXT DEFAULT 'On-Campus',   -- On-Campus, Off-Campus, Pool Drive
  location    TEXT,
  status      TEXT DEFAULT 'Active',      -- Active, Upcoming, Completed
  tpo_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPLICATIONS TABLE (students apply here)
CREATE TABLE IF NOT EXISTS applications (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  placement_id  UUID REFERENCES placements(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'Applied',   -- Applied, Shortlisted, Coding Round, Interview, Selected, Rejected
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, placement_id)        -- prevent duplicate applications
);

-- 3. TRAINING SESSIONS TABLE (TPO posts training sessions)
CREATE TABLE IF NOT EXISTS training_sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT DEFAULT 'General',    -- General, Technical, Aptitude, Soft Skills, HR Prep
  date         DATE,
  time         TEXT,
  venue        TEXT,
  placement_id UUID REFERENCES placements(id) ON DELETE SET NULL,
  tpo_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (optional but recommended)
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — allow all authenticated users to read
CREATE POLICY "Allow read placements" ON placements FOR SELECT USING (true);
CREATE POLICY "Allow read applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow read training_sessions" ON training_sessions FOR SELECT USING (true);

-- Allow insert/update/delete for everyone (backend handles role auth via JWT)
CREATE POLICY "Allow all placements" ON placements FOR ALL USING (true);
CREATE POLICY "Allow all applications" ON applications FOR ALL USING (true);
CREATE POLICY "Allow all training_sessions" ON training_sessions FOR ALL USING (true);
