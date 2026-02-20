-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Batch students (linking students to batches)
CREATE TABLE IF NOT EXISTS batch_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  roll_no TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(batch_id, roll_no)
);

-- Classes table (faculty creates classes linked to a batch)
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject_code TEXT,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
