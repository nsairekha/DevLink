'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../components/dashboard/dashboard';
import './page.css';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { FaPalette, FaImage, FaFont, FaSquare, FaCheck, FaLink as FaLinkIcon, FaCopy } from 'react-icons/fa';

interface ThemeSettings {
  background_type: 'color' | 'gradient' | 'image';
  background_value: string;
  button_style: 'fill' | 'outline' | 'shadow' | 'soft-shadow';
  button_color: string;
  button_text_color: string;
  font_family: string;
}

const backgroundImages = [
  '/theme/1.jpeg',
  '/theme/2.jpeg',
  '/theme/3.jpeg',
  '/theme/4.jpeg',
  '/theme/5.jpeg',
];

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

const solidColors = [
  '#ffffff',
  '#f5f5f5',
  '#000000',
  '#1a1a1a',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
];

const buttonStyles = [
  { name: 'fill', label: 'Fill', preview: 'Filled' },
  { name: 'outline', label: 'Outline', preview: 'Outline' },
  { name: 'shadow', label: 'Shadow', preview: 'Shadow' },
  { name: 'soft-shadow', label: 'Soft Shadow', preview: 'Soft' },
];

const fontFamilies = [
  'Inter',
  'Poppins',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Lato',
];

const ThemePage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [theme, setTheme] = useState<ThemeSettings>({
    background_type: 'color',
    background_value: '#ffffff',
    button_style: 'fill',
    button_color: '#000000',
    button_text_color: '#ffffff',
    font_family: 'Inter',
  });

  useEffect(() => {
    if (user?.id) {
      fetchTheme();
      fetchUsername();
    }
  }, [user?.id]);

  useEffect(() => {
    // Set profile URL on client side only
    if (username && typeof window !== 'undefined') {
      setProfileUrl(`${window.location.origin}/${username}`);
    }
  }, [username]);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`/api/user?userId=${user?.id}`);
      if (response.data.user && response.data.user[0]) {
        setUsername(response.data.user[0].username || '');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchTheme = async () => {
    try {
      const response = await axios.get(`/api/theme?userId=${user?.id}`);
      if (response.data.theme) {
        setTheme(response.data.theme);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching theme:', error);
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      await axios.put('/api/theme', {
        clerkUserId: user?.id,
        ...theme,
      });
      alert('Theme saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme({ ...theme, ...updates });
  };

  const handleCopyLink = () => {
    if (!username) {
      alert('Please set a username in your profile first!');
      return;
    }
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="theme-container">
          <div className="theme-loading">
            <p>Loading theme settings...</p>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="theme-container">
        <div className="theme-wrapper">
          {/* Left Side - Theme Settings */}
          <div className="theme-settings">
            <div className="theme-header">
              <div className="theme-header-content">
                <div>
                  <h1 className="theme-title">
                    <FaPalette /> Customize Your Page
                  </h1>
                  <p className="theme-subtitle">Make your profile page unique</p>
                </div>
                {username && (
                  <button className="copy-link-btn" onClick={handleCopyLink}>
                    {copied ? (
                      <>
                        <FaCheck /> Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy Profile Link
                      </>
                    )}
                  </button>
                )}
              </div>
              {username && profileUrl && (
                <div className="profile-url-display">
                  <FaLinkIcon />
                  <span>{profileUrl}</span>
                </div>
              )}
            </div>

            {/* Background Section */}
            <div className="theme-section">
              <h2 className="section-title">
                <FaImage /> Background
              </h2>

              {/* Background Type Selector */}
              <div className="theme-tabs">
                <button
                  className={`theme-tab ${theme.background_type === 'color' ? 'active' : ''}`}
                  onClick={() => updateTheme({ background_type: 'color', background_value: '#ffffff' })}
                >
                  Colors
                </button>
                <button
                  className={`theme-tab ${theme.background_type === 'gradient' ? 'active' : ''}`}
                  onClick={() => updateTheme({ background_type: 'gradient', background_value: gradients[0] })}
                >
                  Gradients
                </button>
                <button
                  className={`theme-tab ${theme.background_type === 'image' ? 'active' : ''}`}
                  onClick={() => updateTheme({ background_type: 'image', background_value: backgroundImages[0] })}
                >
                  Images
                </button>
              </div>

              {/* Color Options */}
              {theme.background_type === 'color' && (
                <div className="theme-grid">
                  {solidColors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${theme.background_value === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateTheme({ background_value: color })}
                    >
                      {theme.background_value === color && <FaCheck />}
                    </button>
                  ))}
                </div>
              )}

              {/* Gradient Options */}
              {theme.background_type === 'gradient' && (
                <div className="theme-grid">
                  {gradients.map((gradient, index) => (
                    <button
                      key={index}
                      className={`gradient-option ${theme.background_value === gradient ? 'selected' : ''}`}
                      style={{ background: gradient }}
                      onClick={() => updateTheme({ background_value: gradient })}
                    >
                      {theme.background_value === gradient && <FaCheck />}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Options */}
              {theme.background_type === 'image' && (
                <div className="theme-grid">
                  {backgroundImages.map((image, index) => (
                    <button
                      key={index}
                      className={`image-option ${theme.background_value === image ? 'selected' : ''}`}
                      style={{ backgroundImage: `url(${image})` }}
                      onClick={() => updateTheme({ background_value: image })}
                    >
                      {theme.background_value === image && (
                        <div className="image-selected-overlay">
                          <FaCheck />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Button Style Section */}
            <div className="theme-section">
              <h2 className="section-title">
                <FaSquare /> Button Style
              </h2>
              <div className="button-styles-grid">
                {buttonStyles.map((style) => (
                  <button
                    key={style.name}
                    className={`button-style-option ${theme.button_style === style.name ? 'selected' : ''}`}
                    onClick={() => updateTheme({ button_style: style.name as any })}
                  >
                    <div className={`button-preview ${style.name}`}>
                      {style.preview}
                    </div>
                    <span className="button-style-label">{style.label}</span>
                    {theme.button_style === style.name && <FaCheck className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Colors Section */}
            <div className="theme-section">
              <h2 className="section-title">Button Colors</h2>
              <div className="color-pickers">
                <div className="color-picker-group">
                  <label>Button Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={theme.button_color}
                      onChange={(e) => updateTheme({ button_color: e.target.value })}
                      className="color-input"
                    />
                    <span className="color-value">{theme.button_color}</span>
                  </div>
                </div>
                <div className="color-picker-group">
                  <label>Text Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={theme.button_text_color}
                      onChange={(e) => updateTheme({ button_text_color: e.target.value })}
                      className="color-input"
                    />
                    <span className="color-value">{theme.button_text_color}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Font Family Section */}
            <div className="theme-section">
              <h2 className="section-title">
                <FaFont /> Font Family
              </h2>
              <div className="font-grid">
                {fontFamilies.map((font) => (
                  <button
                    key={font}
                    className={`font-option ${theme.font_family === font ? 'selected' : ''}`}
                    style={{ fontFamily: font }}
                    onClick={() => updateTheme({ font_family: font })}
                  >
                    {font}
                    {theme.font_family === font && <FaCheck className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              className="theme-save-btn"
              onClick={handleSaveTheme}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Theme'}
            </button>
          </div>

          {/* Right Side - Preview */}
          <div className="theme-preview">
            <div className="preview-header">
              <h2>Preview</h2>
              <p>See how your page will look</p>
            </div>
            <div className="preview-wrapper">
              <div
                className="preview-container"
                style={{
                  ...(theme.background_type === 'image' 
                    ? {
                        backgroundImage: `url(${theme.background_value})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : {
                        background: theme.background_value,
                      }
                  ),
                  fontFamily: theme.font_family,
                }}
              >
                {/* Profile Section */}
                <div className="preview-profile">
                  <div
                    className="preview-avatar"
                    style={{
                      backgroundImage: user?.imageUrl ? `url(${user.imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <h3 className="preview-name" style={{ fontFamily: theme.font_family }}>
                    {user?.fullName || 'Your Name'}
                  </h3>
                  <p className="preview-bio">Your bio goes here</p>
                </div>

                {/* Links Preview */}
                <div className="preview-links">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`preview-link ${theme.button_style}`}
                      style={{
                        backgroundColor: theme.button_style === 'fill' || theme.button_style === 'shadow' || theme.button_style === 'soft-shadow'
                          ? theme.button_color
                          : 'transparent',
                        color: theme.button_style === 'outline' 
                          ? theme.button_color 
                          : theme.button_text_color,
                        borderColor: theme.button_style === 'outline' 
                          ? theme.button_color 
                          : 'transparent',
                        fontFamily: theme.font_family,
                      }}
                    >
                      Sample Link {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default ThemePage;