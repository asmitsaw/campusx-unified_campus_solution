-- ══════════════════════════════════════════════════════════════
-- VEGAERP Attendance System — Faculty Schedule & Students Setup
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Drop and recreate tables cleanly
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS faculty_schedule CASCADE;
DROP TABLE IF EXISTS faculty_students CASCADE;

-- ── Students table ────────────────────────────────────────────
CREATE TABLE faculty_students (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no     TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE,                  -- matches users.email for student portal
  section     TEXT DEFAULT 'A',
  branch      TEXT DEFAULT 'CSE',
  semester    INT DEFAULT 4,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Faculty schedule (lectures & labs) ───────────────────────
CREATE TABLE faculty_schedule (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id   UUID,                         -- matches users.id
  subject      TEXT NOT NULL,
  type         TEXT DEFAULT 'Lecture',        -- Lecture | Lab | Tutorial
  section      TEXT DEFAULT 'A',
  room         TEXT DEFAULT 'Room 301',
  date         DATE NOT NULL,
  time_start   TEXT NOT NULL,                 -- e.g. "09:00"
  time_end     TEXT NOT NULL,                 -- e.g. "10:00"
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Attendance records ────────────────────────────────────────
CREATE TABLE attendance_records (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id   UUID REFERENCES faculty_schedule(id) ON DELETE CASCADE,
  student_id    UUID REFERENCES faculty_students(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'present',        -- present | absent | late
  marked_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(schedule_id, student_id)
);

-- ══════════════════════════════════════════════════════════════
-- DUMMY DATA: 30 Students (CSE Section A & B, Sem 4)
-- ⚠️  CS22001 email is set to student@campusx.edu — the demo student account.
--     Change this to match the actual student login email in your system.
-- ══════════════════════════════════════════════════════════════
INSERT INTO faculty_students (roll_no, name, email, section, branch, semester) VALUES
  ('CS22001', 'Aarav Patel',       'student@campusx.edu',   'A', 'CSE', 4),
  ('CS22002', 'Sumit Patil',      'sumitpatil141005@gmail.com', 'A', 'CSE', 4),
  ('CS22003', 'Kaustubh Rane',     'kaustubh.anr@gmail.com', 'A', 'CSE', 4),
  ('CS22004', 'Sneha Reddy',       'cs22004@college.edu',   'A', 'CSE', 4),
  ('CS22005', 'Vikram Singh',      'cs22005@college.edu',   'A', 'CSE', 4),
  ('CS22006', 'Ananya Gupta',      'cs22006@college.edu',   'A', 'CSE', 4),
  ('CS22007', 'Deepak Joshi',      'cs22007@college.edu',   'A', 'CSE', 4),
  ('CS22008', 'Kavita Nair',       'cs22008@college.edu',   'A', 'CSE', 4),
  ('CS22009', 'Rohan Mehta',       'cs22009@college.edu',   'A', 'CSE', 4),
  ('CS22010', 'Divya Iyer',        'cs22010@college.edu',   'A', 'CSE', 4),
  ('CS22011', 'Arjun Verma',       'cs22011@college.edu',   'A', 'CSE', 4),
  ('CS22012', 'Pooja Desai',       'cs22012@college.edu',   'A', 'CSE', 4),
  ('CS22013', 'Nikhil Rao',        'cs22013@college.edu',   'A', 'CSE', 4),
  ('CS22014', 'Swati Mishra',      'cs22014@college.edu',   'A', 'CSE', 4),
  ('CS22015', 'Karan Malhotra',    'cs22015@college.edu',   'A', 'CSE', 4),
  ('CS22016', 'Riya Chaudhary',    'cs22016@college.edu',   'B', 'CSE', 4),
  ('CS22017', 'Aditya Kapoor',     'cs22017@college.edu',   'B', 'CSE', 4),
  ('CS22018', 'Neha Saxena',       'cs22018@college.edu',   'B', 'CSE', 4),
  ('CS22019', 'Suraj Tiwari',      'cs22019@college.edu',   'B', 'CSE', 4),
  ('CS22020', 'Tanya Bose',        'cs22020@college.edu',   'B', 'CSE', 4),
  ('CS22021', 'Harsh Pandey',      'cs22021@college.edu',   'B', 'CSE', 4),
  ('CS22022', 'Ishita Agarwal',    'cs22022@college.edu',   'B', 'CSE', 4),
  ('CS22023', 'Mohit Sharma',      'cs22023@college.edu',   'B', 'CSE', 4),
  ('CS22024', 'Anjali Kulkarni',   'cs22024@college.edu',   'B', 'CSE', 4),
  ('CS22025', 'Siddharth Das',     'cs22025@college.edu',   'B', 'CSE', 4),
  ('CS22026', 'Preeti Yadav',      'cs22026@college.edu',   'B', 'CSE', 4),
  ('CS22027', 'Gaurav Srivastava', 'cs22027@college.edu',   'B', 'CSE', 4),
  ('CS22028', 'Meghna Pillai',     'cs22028@college.edu',   'B', 'CSE', 4),
  ('CS22029', 'Yash Tripathi',     'cs22029@college.edu',   'B', 'CSE', 4),
  ('CS22030', 'Shruti Jain',       'cs22030@college.edu',   'B', 'CSE', 4);

-- ══════════════════════════════════════════════════════════════
-- DUMMY DATA: February 2026 Schedule (Mon–Fri lectures + labs)
-- NOTE: faculty_id is NULL here so any faculty can see the schedule.
--       You can later set it to a specific UUID from your users table.
-- ══════════════════════════════════════════════════════════════
INSERT INTO faculty_schedule (subject, type, section, room, date, time_start, time_end) VALUES
  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-02', '09:00', '10:00'),
  ('Operating Systems',      'Lecture',  'A', 'Room 302',    '2026-02-02', '11:00', '12:00'),
  ('DBMS',                   'Lecture',  'B', 'Room 201',    '2026-02-02', '14:00', '15:00'),

  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-03', '09:00', '10:00'),
  ('Computer Networks',      'Lecture',  'B', 'Room 303',    '2026-02-03', '11:00', '12:00'),
  ('Software Engineering',   'Tutorial', 'A', 'Room 105',    '2026-02-03', '13:00', '14:00'),

  ('Operating Systems',      'Lab',      'A', 'OS Lab 101',  '2026-02-04', '09:00', '11:00'),
  ('DBMS',                   'Lecture',  'A', 'Room 201',    '2026-02-04', '14:00', '15:00'),

  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-05', '09:00', '10:00'),
  ('Computer Networks',      'Lab',      'B', 'CN Lab 202',  '2026-02-05', '11:00', '13:00'),

  ('Software Engineering',   'Lecture',  'A', 'Room 105',    '2026-02-06', '10:00', '11:00'),
  ('DBMS',                   'Lecture',  'B', 'Room 201',    '2026-02-06', '14:00', '15:00'),

  -- Week 2
  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-09', '09:00', '10:00'),
  ('Operating Systems',      'Lecture',  'A', 'Room 302',    '2026-02-09', '11:00', '12:00'),
  ('Computer Networks',      'Lecture',  'B', 'Room 303',    '2026-02-09', '14:00', '15:00'),

  ('Data Structures',        'Lab',      'A', 'DS Lab 103',  '2026-02-10', '09:00', '11:00'),
  ('Software Engineering',   'Lecture',  'B', 'Room 105',    '2026-02-10', '13:00', '14:00'),

  ('Operating Systems',      'Lecture',  'A', 'Room 302',    '2026-02-11', '09:00', '10:00'),
  ('DBMS',                   'Lab',      'B', 'DB Lab 204',  '2026-02-11', '11:00', '13:00'),

  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-12', '09:00', '10:00'),
  ('Computer Networks',      'Lecture',  'A', 'Room 303',    '2026-02-12', '11:00', '12:00'),

  ('Software Engineering',   'Tutorial', 'B', 'Room 105',    '2026-02-13', '10:00', '11:00'),
  ('DBMS',                   'Lecture',  'A', 'Room 201',    '2026-02-13', '14:00', '15:00'),

  -- Week 3
  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-16', '09:00', '10:00'),
  ('Operating Systems',      'Lab',      'B', 'OS Lab 101',  '2026-02-16', '11:00', '13:00'),

  ('Computer Networks',      'Lecture',  'A', 'Room 303',    '2026-02-17', '09:00', '10:00'),
  ('Software Engineering',   'Lecture',  'A', 'Room 105',    '2026-02-17', '11:00', '12:00'),
  ('DBMS',                   'Lecture',  'B', 'Room 201',    '2026-02-17', '14:00', '15:00'),

  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-18', '09:00', '10:00'),
  ('Operating Systems',      'Lecture',  'A', 'Room 302',    '2026-02-18', '11:00', '12:00'),

  ('Computer Networks',      'Lab',      'A', 'CN Lab 202',  '2026-02-19', '09:00', '11:00'),
  ('DBMS',                   'Lecture',  'A', 'Room 201',    '2026-02-19', '14:00', '15:00'),

  ('Software Engineering',   'Lecture',  'B', 'Room 105',    '2026-02-20', '10:00', '11:00'),
  ('Data Structures',        'Tutorial', 'B', 'Room 301',    '2026-02-20', '14:00', '15:00'),
  ('Computer Networks',      'Lecture',  'B', 'Room 303',    '2026-02-20', '16:00', '17:00'),

  -- Week 4
  ('Operating Systems',      'Lecture',  'A', 'Room 302',    '2026-02-23', '09:00', '10:00'),
  ('Data Structures',        'Lab',      'B', 'DS Lab 103',  '2026-02-23', '11:00', '13:00'),

  ('DBMS',                   'Lecture',  'A', 'Room 201',    '2026-02-24', '09:00', '10:00'),
  ('Computer Networks',      'Lecture',  'A', 'Room 303',    '2026-02-24', '11:00', '12:00'),
  ('Software Engineering',   'Lab',      'B', 'Room 105',    '2026-02-24', '14:00', '16:00'),

  ('Data Structures',        'Lecture',  'A', 'Room 301',    '2026-02-25', '09:00', '10:00'),
  ('Operating Systems',      'Tutorial', 'B', 'Room 302',    '2026-02-25', '11:00', '12:00'),

  ('Computer Networks',      'Lecture',  'B', 'Room 303',    '2026-02-26', '09:00', '10:00'),
  ('DBMS',                   'Lab',      'A', 'DB Lab 204',  '2026-02-26', '11:00', '13:00'),

  ('Software Engineering',   'Lecture',  'A', 'Room 105',    '2026-02-27', '10:00', '11:00'),
  ('Data Structures',        'Lecture',  'B', 'Room 301',    '2026-02-27', '14:00', '15:00');

-- ══════════════════════════════════════════════════════════════
-- SEED ATTENDANCE for all demo student accounts
-- Section A sessions up to Feb 20, 2026
-- ══════════════════════════════════════════════════════════════

-- ✅ CS22001 · student@campusx.edu (Aarav Patel) — ~78% (Borderline Safe)
INSERT INTO attendance_records (schedule_id, student_id, status)
SELECT
  fs.id  AS schedule_id,
  fst.id AS student_id,
  CASE
    WHEN fs.date IN ('2026-02-04','2026-02-10','2026-02-18') THEN 'absent'
    ELSE 'present'
  END    AS status
FROM faculty_schedule fs
JOIN faculty_students fst ON fst.email = 'student@campusx.edu'
WHERE fs.section = 'A' AND fs.date < '2026-02-21'
ON CONFLICT (schedule_id, student_id) DO NOTHING;

-- ✅ CS22002 · sumitpatil141005@gmail.com (Priya Sharma) — ~82% (Safe)
INSERT INTO attendance_records (schedule_id, student_id, status)
SELECT
  fs.id  AS schedule_id,
  fst.id AS student_id,
  CASE
    WHEN fs.date IN ('2026-02-05','2026-02-13') THEN 'absent'
    ELSE 'present'
  END    AS status
FROM faculty_schedule fs
JOIN faculty_students fst ON fst.email = 'sumitpatil141005@gmail.com'
WHERE fs.section = 'A' AND fs.date < '2026-02-21'
ON CONFLICT (schedule_id, student_id) DO NOTHING;

-- ⚠️  CS22003 · kaustubh.anr@gmail.com (Kaustubh Rane) — ~68% (At Risk)
INSERT INTO attendance_records (schedule_id, student_id, status)
SELECT
  fs.id  AS schedule_id,
  fst.id AS student_id,
  CASE
    WHEN fs.date IN (
      '2026-02-02','2026-02-05','2026-02-09',
      '2026-02-11','2026-02-17','2026-02-19'
    ) THEN 'absent'
    ELSE 'present'
  END    AS status
FROM faculty_schedule fs
JOIN faculty_students fst ON fst.email = 'kaustubh.anr@gmail.com'
WHERE fs.section = 'A' AND fs.date < '2026-02-21'
ON CONFLICT (schedule_id, student_id) DO NOTHING;

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');
