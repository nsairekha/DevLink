-- Migration to add bio column and update links table structure
-- Run this if you have existing tables

-- Add bio column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio VARCHAR(80);

-- Modify links table to add new columns if they don't exist
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS link_type ENUM('social', 'project') NOT NULL DEFAULT 'project' AFTER user_id,
ADD COLUMN IF NOT EXISTS icon VARCHAR(50) AFTER url,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE AFTER icon,
ADD COLUMN IF NOT EXISTS clicks INT DEFAULT 0 AFTER is_visible,
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER clicks;

-- Drop old icon_url column if it exists
ALTER TABLE links 
DROP COLUMN IF EXISTS icon_url;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_link_type ON links(link_type);
CREATE INDEX IF NOT EXISTS idx_display_order ON links(display_order);
