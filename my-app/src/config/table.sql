
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS DevLink;

-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,  -- Clerk user ID
    email VARCHAR(255) NOT NULL UNIQUE,          -- User email
    name VARCHAR(255),                           -- Full name from provider
    image_url TEXT,                              -- Profile picture
    provider ENUM('google', 'github', 'clerk') NOT NULL,  -- Auth provider
    username VARCHAR(100) UNIQUE,             -- Unique username for the user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);