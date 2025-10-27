'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
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

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

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

  return (
    <div
      className="public-profile-container"
      style={{
        ...backgroundStyle,
      }}
    >
      <div 
        className="public-profile-content"
        style={{
          fontFamily: profile.font_family || 'Inter',
        }}
      >
        {/* Profile Header */}
        <div className="public-profile-header">
          <div
            className="public-avatar"
            style={{
              backgroundImage: profile.image_url ? `url(${profile.image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <h1 className="public-name">{profile.name}</h1>
          {profile.bio && <p className="public-bio">{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="public-links">
          {links.length === 0 ? (
            <p className="no-links">No links to display</p>
          ) : (
            links.map((link) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <button
                  key={link.id}
                  className={`public-link ${profile.button_style}`}
                  style={{
                    backgroundColor:
                      profile.button_style === 'fill' ||
                      profile.button_style === 'shadow' ||
                      profile.button_style === 'soft-shadow'
                        ? profile.button_color
                        : 'rgba(255, 255, 255, 0.9)',
                    color:
                      profile.button_style === 'outline'
                        ? profile.button_color
                        : profile.button_text_color,
                    borderColor:
                      profile.button_style === 'outline'
                        ? profile.button_color
                        : 'transparent',
                  }}
                  onClick={() => handleLinkClick(link.id, link.url)}
                >
                  <IconComponent className="link-icon" />
                  <span>{link.title}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="public-footer">
          <p>Powered by DevLink</p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
