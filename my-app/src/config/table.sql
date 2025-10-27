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
    username VARCHAR(100) UNIQUE,                -- Unique username for the user
    bio VARCHAR(80),                              -- User bio (max 80 characters)
    is_suspended BOOLEAN DEFAULT FALSE,          -- User suspension status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- links table
CREATE TABLE links (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- user themes table
CREATE TABLE user_themes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                        -- Foreign key to users table
    theme_name VARCHAR(100) NOT NULL,            -- Name of the theme
    theme_data JSON NOT NULL,                    -- JSON data for the theme
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    background_type ENUM('color', 'gradient', 'image') DEFAULT 'color',
    background_value VARCHAR(255) DEFAULT '#ffffff',
    button_style ENUM('fill', 'outline', 'shadow', 'soft-shadow') DEFAULT 'fill',
    button_color VARCHAR(50) DEFAULT '#000000',
    button_text_color VARCHAR(50) DEFAULT '#ffffff',
    font_family VARCHAR(50) DEFAULT 'Inter',
    theme_preset VARCHAR(50) DEFAULT NULL
);

-- Indexes for optimization
CREATE INDEX idx_user_id ON links(user_id);
CREATE INDEX idx_user_theme_user_id ON user_themes(user_id);
CREATE INDEX idx_provider ON users(provider);
CREATE INDEX idx_username ON users(username);