-- Hostel Rooms
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block TEXT NOT NULL,
  room_no TEXT NOT NULL UNIQUE,
  capacity INT DEFAULT 1,
  student_name TEXT,
  student_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Vacant' CHECK (status IN ('Occupied', 'Vacant', 'Maintenance')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hostel Complaints
CREATE TABLE IF NOT EXISTS hostel_complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  student_name TEXT NOT NULL,
  room_no TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mess Menu
CREATE TABLE IF NOT EXISTS mess_menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal TEXT NOT NULL CHECK (meal IN ('Breakfast', 'Lunch', 'Snacks', 'Dinner')),
  time_slot TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  day_of_week TEXT NOT NULL DEFAULT 'Monday' CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(meal, day_of_week)
);

-- Seed default mess menu for today (Monday)
INSERT INTO mess_menu (meal, time_slot, items, day_of_week) VALUES
  ('Breakfast', '07:30 - 09:30', ARRAY['Masala Dosa', 'Sambar & Chutney', 'Tea/Coffee'], 'Monday'),
  ('Lunch', '12:30 - 14:30', ARRAY['Veg Pulao', 'Dal Fry', 'Raita', 'Roti'], 'Monday'),
  ('Snacks', '17:00 - 18:00', ARRAY['Samosa', 'Tea'], 'Monday'),
  ('Dinner', '20:00 - 21:30', ARRAY['Chapati', 'Paneer Butter Masala', 'Rice'], 'Monday')
ON CONFLICT (meal, day_of_week) DO NOTHING;
