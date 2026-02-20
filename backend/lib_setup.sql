-- Run this in Supabase SQL Editor to add name/email columns to book_requests

alter table book_requests
  add column if not exists user_name  text,
  add column if not exists user_email text;
