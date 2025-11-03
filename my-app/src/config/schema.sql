-- =====================================================
-- DevLink Database Schema - Complete Setup
-- =====================================================
-- This file contains the complete database schema for DevLink
-- Run this file to set up a new database from scratch
-- =====================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS DevLink;
USE DevLink;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table - Stores user account information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,  -- Clerk user ID
    email VARCHAR(255) NOT NULL UNIQUE,          -- User email
    name VARCHAR(255),                           -- Full name from provider
    image_url TEXT,                              -- Profile picture
    provider ENUM('google', 'github', 'clerk') NOT NULL,  -- Auth provider
    username VARCHAR(100) UNIQUE,                -- Unique username for the user
    bio VARCHAR(80),                             -- User bio (max 80 characters)
    is_suspended BOOLEAN DEFAULT FALSE,          -- User suspension status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_provider (provider),
    INDEX idx_username (username)
);

-- Links table - Stores user links (social & project)
CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                        -- Foreign key to users table
    link_type ENUM('social', 'project') NOT NULL DEFAULT 'project', -- Type of link
    title VARCHAR(255) NOT NULL,                 -- Title of the link
    url TEXT NOT NULL,                           -- URL of the link
    icon VARCHAR(50),                            -- Icon name (e.g., FaInstagram)
    is_visible BOOLEAN DEFAULT TRUE,             -- Visibility status
    clicks INT DEFAULT 0,                        -- Click count
    display_order INT DEFAULT 0,                 -- Order for displaying links
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_link_type (link_type),
    INDEX idx_display_order (display_order)
);

-- User themes table - Stores custom theme settings
CREATE TABLE IF NOT EXISTS user_themes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                        -- Foreign key to users table
    theme_name VARCHAR(100) NOT NULL,            -- Name of the theme
    theme_data JSON NOT NULL,                    -- JSON data for the theme
    background_type ENUM('color', 'gradient', 'image') DEFAULT 'color',
    background_value VARCHAR(255) DEFAULT '#ffffff',
    button_style ENUM('fill', 'outline', 'shadow', 'soft-shadow') DEFAULT 'fill',
    button_color VARCHAR(50) DEFAULT '#000000',
    button_text_color VARCHAR(50) DEFAULT '#ffffff',
    font_family VARCHAR(50) DEFAULT 'Inter',
    theme_preset VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_theme_user_id (user_id)
);

-- Clicks log table - Detailed analytics tracking
CREATE TABLE IF NOT EXISTS clicks_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id INT NOT NULL,
    user_id INT NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_link_id (link_id),
    INDEX idx_user_id (user_id),
    INDEX idx_clicked_at (clicked_at)
);

-- =====================================================
-- MIGRATION QUERIES (For existing databases)
-- =====================================================
-- Use these ALTER statements if you're upgrading an existing database
-- Comment out or skip if running on a fresh database

-- Add bio column to users table if it doesn't exist
-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS bio VARCHAR(80);

-- Add is_suspended column to users table if it doesn't exist
-- ALTER TABLE users 
-- ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE AFTER bio;

-- Modify links table to add new columns if they don't exist
-- ALTER TABLE links 
-- ADD COLUMN IF NOT EXISTS link_type ENUM('social', 'project') NOT NULL DEFAULT 'project' AFTER user_id,
-- ADD COLUMN IF NOT EXISTS icon VARCHAR(50) AFTER url,
-- ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE AFTER icon,
-- ADD COLUMN IF NOT EXISTS clicks INT DEFAULT 0 AFTER is_visible,
-- ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0 AFTER clicks;

-- Drop old icon_url column if it exists
-- ALTER TABLE links 
-- DROP COLUMN IF EXISTS icon_url;

-- Add indexes for better query performance (if they don't exist)
-- CREATE INDEX IF NOT EXISTS idx_link_type ON links(link_type);
-- CREATE INDEX IF NOT EXISTS idx_display_order ON links(display_order);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Database schema is now ready for use
-- Next steps:
-- 1. Update your .env file with database credentials
-- 2. Run your application: npm run dev
-- 3. Test authentication and create your first profile
-- =====================================================
