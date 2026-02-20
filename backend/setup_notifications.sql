-- setup_notifications.sql
-- Run this in your Supabase SQL Editor to create the notifications table.

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Target user
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- e.g., 'placement', 'event', 'library', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255), -- Optional URL to redirect the user when clicked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Ensure that the 'users' table exists and has an 'id' column of type UUID.
-- If 'users' id is not UUID (e.g., Integer), change 'user_id UUID' to match the 'users' table primary key type.
