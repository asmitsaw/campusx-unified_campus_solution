-- Add user_id column to batch_students (links to users table)
ALTER TABLE batch_students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_batch_students_user_id ON batch_students(user_id);
