-- ═══════════════════════════════════════════════════════════════
-- VEGAERP Placement System — FRESH SETUP (Drop & Recreate)
-- ⚠️  Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Step 1: Drop old tables (CASCADE removes dependent foreign keys)
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS placements CASCADE;

-- Step 2: Recreate with full schema
CREATE TABLE placements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  package_lpa NUMERIC NOT NULL,
  deadline    DATE,
  drive_date  DATE,
  description TEXT,
  eligibility TEXT,
  type        TEXT DEFAULT 'On-Campus',
  location    TEXT,
  status      TEXT DEFAULT 'Active',
  tpo_id      UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  placement_id  UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'Applied',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, placement_id)
);

CREATE TABLE training_sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT DEFAULT 'General',
  date         DATE,
  time         TEXT,
  venue        TEXT,
  placement_id UUID REFERENCES placements(id) ON DELETE SET NULL,
  tpo_id       UUID,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE placements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- Step 4: Policies (backend JWT handles role-based auth)
CREATE POLICY "Allow all placements"        ON placements        FOR ALL USING (true);
CREATE POLICY "Allow all applications"      ON applications      FOR ALL USING (true);
CREATE POLICY "Allow all training_sessions" ON training_sessions FOR ALL USING (true);

-- Step 5: Reload schema cache
SELECT pg_notify('pgrst', 'reload schema');
