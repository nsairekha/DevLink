'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import './page.css';
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaDiscord,
  FaTwitch,
  FaSnapchat,
  FaReddit,
  FaPinterest,
  FaWhatsapp,
  FaTelegram,
  FaLink,
  FaGlobe,
  FaShare,
} from 'react-icons/fa';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  image_url: string;
  background_type: string;
  background_value: string;
  button_style: string;
  button_color: string;
  button_text_color: string;
  font_family: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_visible: boolean;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaGithub,
    FaYoutube,
    FaFacebook,
    FaTiktok,
    FaDiscord,
    FaTwitch,
    FaSnapchat,
    FaReddit,
    FaPinterest,
    FaWhatsapp,
    FaTelegram,
    FaLink,
    FaGlobe,
  };
  return icons[iconName] || FaLink;
};

const PublicProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profile && typeof window !== 'undefined') {
      // Update meta tags dynamically
      document.title = `${profile.name} | DevLink`;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', profile.bio || `Check out ${profile.name}'s links on DevLink`);
      
      // OpenGraph tags
      const ogTags = [
        { property: 'og:title', content: `${profile.name} | DevLink` },
        { property: 'og:description', content: profile.bio || `Check out ${profile.name}'s links on DevLink` },
        { property: 'og:type', content: 'profile' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:image', content: profile.image_url || '/logo.png' },
      ];
      
      ogTags.forEach(tag => {
        let element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', tag.property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', tag.content);
      });
      
      // Twitter Card tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${profile.name} | DevLink` },
        { name: 'twitter:description', content: profile.bio || `Check out ${profile.name}'s links on DevLink` },
        { name: 'twitter:image', content: profile.image_url || '/logo.png' },
      ];
      
      twitterTags.forEach(tag => {
        let element = document.querySelector(`meta[name="${tag.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', tag.name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', tag.content);
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/public-profile?username=${username}`);
      setProfile(response.data.profile);
      setLinks(response.data.links.filter((link: Link) => link.is_visible));
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        setNotFound(true);
      }
      setLoading(false);
    }
  };

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click
    try {
      await axios.post('/api/track-click', { linkId });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
    // Open link
    window.open(url, '_blank');
  };

  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;
    
    const currentUrl = window.location.href;
    const shareText = `Check out ${profile?.name || username}'s links on DevLink!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="public-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="public-profile-not-found">
        <h1>404</h1>
        <p>Profile not found</p>
        <a href="/">Go to Home</a>
      </div>
    );
  }

  const backgroundStyle = 
    profile.background_type === 'image'
      ? {
          backgroundImage: `url(${profile.background_value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { background: profile.background_value };

  // Derive a compact social icon row from available links (limit 6 unique platforms)
  const socialPlatformsOrder = [
    'FaXTwitter',
    'FaTwitter',
    'FaInstagram',
    'FaLinkedin',
    'FaTelegram',
    'FaDiscord',
    'FaGithub',
    'FaYoutube',
    'FaFacebook'
  ];
  const iconNameToLabel: Record<string, string> = {
    FaXTwitter: 'X',
    FaTwitter: 'Twitter',
    FaInstagram: 'Instagram',
    FaLinkedin: 'LinkedIn',
    FaTelegram: 'Telegram',
    FaDiscord: 'Discord',
    FaGithub: 'GitHub',
    FaYoutube: 'YouTube',
    FaFacebook: 'Facebook',
  };
  const uniquePlatformFirstLink: { [platform: string]: Link } = {};
  links.forEach((l) => {
    if (!uniquePlatformFirstLink[l.icon]) uniquePlatformFirstLink[l.icon] = l;
  });
  const socialRow = socialPlatformsOrder
    .filter((key) => !!uniquePlatformFirstLink[key])
    .slice(0, 6)
    .map((key) => ({ label: iconNameToLabel[key] || key.replace('Fa', ''), link: uniquePlatformFirstLink[key] }));

  // Prepare links - only show non-social platform links as big buttons
  // Social links are shown as icons in the header
  const socialPlatforms = [
    'FaXTwitter', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 
    'FaTelegram', 'FaDiscord', 'FaGithub', 'FaYoutube', 
    'FaFacebook', 'FaTiktok', 'FaTwitch', 'FaSnapchat', 
    'FaReddit', 'FaPinterest', 'FaWhatsapp'
  ];
  
  const projectLinks = links.filter(link => !socialPlatforms.includes(link.icon));
  
  const renderedLinkItems: React.ReactElement[] = projectLinks.map((link, index) => {
    const IconComponent = getIconComponent(link.icon);
    return (
      <motion.button
        key={link.id}
        className={`public-link ${profile?.button_style}`}
        style={{
          backgroundColor:
            profile?.button_style === 'fill' ||
            profile?.button_style === 'shadow' ||
            profile?.button_style === 'soft-shadow'
              ? profile?.button_color
              : 'rgba(255, 255, 255, 0.9)',
          color:
            profile?.button_style === 'outline'
              ? profile?.button_color
              : profile?.button_text_color,
          borderColor:
            profile?.button_style === 'outline'
              ? profile?.button_color
              : 'transparent',
        }}
        onClick={() => handleLinkClick(link.id, link.url)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 + (index * 0.05) }}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
      >
        <IconComponent className="link-icon" />
        <span>{link.title}</span>
      </motion.button>
    );
  });

  return (
    <div
      className="public-profile-container"
    >
      {/* QR Code - Fixed to page corner */}
      {typeof window !== 'undefined' && (
        <div className="page-qr-code">
          <div className="page-qr-wrapper">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(window.location.href)}`}
              alt="QR Code"
            />
          </div>
          <span className="page-qr-label">View on mobile</span>
        </div>
      )}

      <div 
        className="public-profile-content"
        style={{
          fontFamily: profile.font_family || 'Inter',
        }}
      >
        {/* Card wrapper to mimic Linktree panel */}
        <div 
          className="public-card"
          style={{
            ...backgroundStyle,
          }}
        >
          {/* Top actions */}
          <div className="top-actions">
             
            <div className="spacer" />
            <div className="share-button-container">
              <button 
                className="round-action"
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label="share"
              >
                <FaShare />
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div 
                    className="share-menu"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button onClick={() => handleShare('twitter')} className="share-option twitter">
                      <FaTwitter /> Twitter
                    </button>
                    <button onClick={() => handleShare('facebook')} className="share-option facebook">
                      <FaFacebook /> Facebook
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="share-option whatsapp">
                      <FaWhatsapp /> WhatsApp
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="share-option linkedin">
                      <FaLinkedin /> LinkedIn
                    </button>
                    <button onClick={() => handleShare('copy')} className="share-option copy">
                      <FaLink /> Copy Link
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Profile Header */}
          <motion.div 
            className="public-profile-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="public-avatar"
              style={{
                backgroundImage: profile.image_url ? `url(${profile.image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.h1 
              className="public-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile.name}
            </motion.h1>
            {/* Social Icons Row */}
            {socialRow.length > 0 && (
              <div className="social-icons">
                {socialRow.map(({ label, link }) => {
                  const IconComponent = getIconComponent(link.icon);
                  return (
                    <button
                      key={`social-${label}`}
                      className="social-icon-btn"
                      onClick={() => handleLinkClick(link.id, link.url)}
                      aria-label={label}
                    >
                      <IconComponent />
                    </button>
                  );
                })}
              </div>
            )}
            {profile.bio && (
              <motion.p 
                className="public-bio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {profile.bio}
              </motion.p>
            )}
          </motion.div>

          {/* Links */}
          <div className="public-links">
            {projectLinks.length === 0 ? (
              <p className="no-links">No links to display</p>
            ) : (
              renderedLinkItems
            )}
          </div>

          {/* Footer */}
          <div className="public-footer">
            <p>Powered by DevLink</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
