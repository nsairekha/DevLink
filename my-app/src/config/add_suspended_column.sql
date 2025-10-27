-- Add is_suspended column to users table for admin management
ALTER TABLE users 
ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE AFTER bio;
