'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../components/dashboard/dashboard';
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
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

interface Link {
  id: string;
  link_type: 'social' | 'project';
  title: string;
  url: string;
  icon: string;
  is_visible: boolean;
  clicks: number;
}

const socialMediaOptions = [
  { name: 'Instagram', icon: 'FaInstagram', color: '#E4405F' },
  { name: 'Twitter', icon: 'FaTwitter', color: '#1DA1F2' },
  { name: 'LinkedIn', icon: 'FaLinkedin', color: '#0077B5' },
  { name: 'GitHub', icon: 'FaGithub', color: '#181717' },
  { name: 'YouTube', icon: 'FaYoutube', color: '#FF0000' },
  { name: 'Facebook', icon: 'FaFacebook', color: '#1877F2' },
  { name: 'TikTok', icon: 'FaTiktok', color: '#000000' },
  { name: 'Discord', icon: 'FaDiscord', color: '#5865F2' },
  { name: 'Twitch', icon: 'FaTwitch', color: '#9146FF' },
  { name: 'Snapchat', icon: 'FaSnapchat', color: '#FFFC00' },
  { name: 'Reddit', icon: 'FaReddit', color: '#FF4500' },
  { name: 'Pinterest', icon: 'FaPinterest', color: '#E60023' },
  { name: 'WhatsApp', icon: 'FaWhatsapp', color: '#25D366' },
  { name: 'Telegram', icon: 'FaTelegram', color: '#0088CC' },
];

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

const EditLinks = () => {
  const { user } = useUser();
  const [links, setLinks] = useState<Link[]>([]);
  const [modalType, setModalType] = useState<'social' | 'project' | null>(null);
  const [selectedSocial, setSelectedSocial] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [bio, setBio] = useState('');
  const [bioOriginal, setBioOriginal] = useState('');
  const [showBioInput, setShowBioInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [showPhotoControls, setShowPhotoControls] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Fetch user's links and bio on component mount
  useEffect(() => {
    if (user?.id) {
      fetchLinks();
      fetchBio();
      fetchUserImage();
    }
  }, [user?.id]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`/api/links?userId=${user?.id}`);
      setLinks(response.data.links || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching links:', error);
      setLoading(false);
    }
  };

  const fetchBio = async () => {
    try {
      const response = await axios.get(`/api/bio?userId=${user?.id}`);
      const fetchedBio = response.data.bio || '';
      setBio(fetchedBio);
      setBioOriginal(fetchedBio);
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  const fetchUserImage = async () => {
    try {
      const response = await axios.get(`/api/user?userId=${user?.id}`);
      const rows = (response.data.user as any[]) || [];
      const row = rows[0];
      const current = row?.image_url || user?.imageUrl || '';
      setImageUrl(current);
      setOriginalImageUrl(current);
    } catch (error) {
      console.error('Error fetching user image:', error);
      const fallback = user?.imageUrl || '';
      setImageUrl(fallback);
      setOriginalImageUrl(fallback);
    }
  };

  const handleSelectFile = async (file: File) => {
    if (!user?.id) return;
    try {
      setImageError(null);
      setSelectedFileName(file.name);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('clerkUserId', user.id);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImageUrl(data.url);
    } catch (e) {
      console.error('Upload failed:', e);
      setImageError('Upload failed. Please try a smaller JPG/PNG/WebP (max 5MB).');
    }
  };

  const handleSaveImage = async () => {
    if (!user?.id) return;
    try {
      setSavingImage(true);
      await axios.put('/api/user', {
        clerkUserId: user.id,
        imageUrl,
      });
      setOriginalImageUrl(imageUrl);
      setShowPhotoControls(false);
      setSelectedFileName(null);
    } catch (error) {
      console.error('Error saving profile photo:', error);
      setImageError('Failed to save profile photo.');
    } finally {
      setSavingImage(false);
    }
  };

  const handleCancelImageChanges = () => {
    setImageUrl(originalImageUrl);
    setSelectedFileName(null);
    setImageError(null);
    setShowPhotoControls(false);
  };

  const handleAddLink = () => {
    setModalType(null);
    setSelectedSocial('');
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleSelectType = (type: 'social' | 'project') => {
    setModalType(type);
    if (type === 'project') {
      setNewLinkTitle('');
      setNewLinkUrl('');
    }
  };

  const handleSocialSelect = (socialName: string, iconName: string) => {
    setSelectedSocial(iconName);
    setNewLinkTitle(socialName);
  };

  const handleSaveLink = async () => {
    if (!newLinkUrl.trim() || !newLinkTitle.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('/api/links', {
        clerkUserId: user?.id,
        type: modalType || 'project',
        title: newLinkTitle,
        url: newLinkUrl,
        icon: modalType === 'social' ? selectedSocial : 'FaLink',
      });

      // Refresh links after adding
      await fetchLinks();

      setModalType(null);
      setSelectedSocial('');
      setNewLinkTitle('');
      setNewLinkUrl('');
    } catch (error) {
      console.error('Error saving link:', error);
      alert('Failed to save link. Please try again.');
    }
  };

  const handleCancelAdd = () => {
    setModalType(null);
    setSelectedSocial('');
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await axios.delete(`/api/links?linkId=${id}&userId=${user?.id}`);
      setLinks(links.filter((link) => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link. Please try again.');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;

    try {
      await axios.put('/api/links', {
        linkId: id,
        clerkUserId: user?.id,
        isVisible: !link.is_visible,
      });

      setLinks(
        links.map((link) =>
          link.id === id ? { ...link, is_visible: !link.is_visible } : link
        )
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to update link visibility. Please try again.');
    }
  };

  const handleUpdateLinkTitle = async (id: string, title: string) => {
    try {
      await axios.put('/api/links', {
        linkId: id,
        clerkUserId: user?.id,
        title,
      });

      setLinks(
        links.map((link) => (link.id === id ? { ...link, title } : link))
      );
    } catch (error) {
      console.error('Error updating link title:', error);
    }
  };

  const handleUpdateLinkUrl = async (id: string, url: string) => {
    try {
      await axios.put('/api/links', {
        linkId: id,
        clerkUserId: user?.id,
        url,
      });

      setLinks(links.map((link) => (link.id === id ? { ...link, url } : link)));
    } catch (error) {
      console.error('Error updating link url:', error);
    }
  };

  const handleBioSave = async () => {
    try {
      await axios.put('/api/bio', {
        clerkUserId: user?.id,
        bio,
      });
      setBioOriginal(bio);
      setShowBioInput(false);
    } catch (error) {
      console.error('Error saving bio:', error);
      alert('Failed to save bio. Please try again.');
    }
  };

  const handleCancelBio = () => {
    setBio(bioOriginal);
    setShowBioInput(false);
  };

  return (
    <Dashboard>
      <div className="edit-links-container">
        <div className="edit-links-wrapper">
          {/* Left Side - Links List */}
          <div className="edit-links-content">
            {/* Header Section - Profile Info */}
            <div className="profile-header">
              <div style={{ position: 'relative', width: 88, height: 88 }}>
                <div
                  className="avatar-placeholder"
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: 88,
                    height: 88,
                    borderRadius: '9999px',
                  }}
                ></div>
                <button
                  aria-label="Edit photo"
                  onClick={() => setShowPhotoControls((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: -6,
                    bottom: -6,
                    height: 32,
                    padding: '0 10px',
                    borderRadius: 16,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="profile-info" style={{ minWidth: 0 }}>
                <h2 className="username">{user?.username || user?.firstName || 'User'}</h2>

                {showPhotoControls && (
                  <div
                    className="photo-controls"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginTop: '0.25rem',
                    }}
                  >
                    <input
                      type="url"
                      className="form-input"
                      placeholder="Image URL (optional)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ maxWidth: 360 }}
                    />
                    <button
                      className="save-button"
                      onClick={handleSaveImage}
                      disabled={savingImage || imageUrl === originalImageUrl}
                    >
                      {savingImage ? 'Saving...' : 'Save Photo'}
                    </button>
                    <button className="cancel-button" onClick={handleCancelImageChanges}>
                      Cancel
                    </button>
                    <div style={{ width: '100%', fontSize: 12, color: '#6b7280' }}>
                      {selectedFileName ? `Selected: ${selectedFileName}` : 'Max 5MB · JPG/PNG/WebP'}
                    </div>
                    {imageError && (
                      <div style={{ width: '100%', fontSize: 12, color: '#b91c1c' }}>{imageError}</div>
                    )}
                  </div>
                )}

                {!showBioInput ? (
                  <p
                    className="add-bio"
                    style={{ marginTop: 8 }}
                    onClick={() => setShowBioInput(true)}
                  >
                    {bio || 'Add bio'}
                  </p>
                ) : (
                  <div className="bio-input-container" style={{ marginTop: 8 }}>
                    <textarea
                      className="bio-input"
                      placeholder="Tell your story..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={80}
                      rows={2}
                      autoFocus
                    />
                    <div className="bio-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="bio-char-count" style={{ marginRight: 'auto', color: '#6b7280' }}>
                        {bio.length}/80
                      </span>
                      <button
                        className="bio-save-btn"
                        onClick={handleBioSave}
                        disabled={bio === bioOriginal}
                      >
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancelBio}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

         

            {/* Display Links */}
            {loading ? (
              <div className="empty-state">
                <div className="empty-state-icon">⏳</div>
                <h3 className="empty-state-title">Loading...</h3>
              </div>
            ) : links.map((link) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <div key={link.id} className="link-card">
                  <div className="link-card-header">
                    <div className="link-title-section">
                      <div className="link-icon" style={{ color: '#000000' }}>
                        <IconComponent size={24} />
                      </div>
                      <input
                        type="text"
                        className="link-title-input"
                        value={link.title}
                        onChange={(e) =>
                          handleUpdateLinkTitle(link.id, e.target.value)
                        }
                      />
                      {link.link_type === 'project' && (
                        <span className="link-badge">Project</span>
                      )}
                    </div>
                    <div className="link-actions">
                      <button
                        className={`toggle-switch ${
                          link.is_visible ? 'active' : ''
                        }`}
                        onClick={() => handleToggleVisibility(link.id)}
                        title="Toggle visibility"
                      >
                        <span className="toggle-slider"></span>
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => handleDeleteLink(link.id)}
                        title="Delete"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="link-url-section">
                    <input
                      type="url"
                      className="link-url-input"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleUpdateLinkUrl(link.id, e.target.value)}
                    />
                  </div>

                  <div className="link-stats">
                    <span className="clicks-count">{link.clicks} clicks</span>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {links.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-state-icon">🔗</div>
                <h3 className="empty-state-title">No links yet</h3>
                <p className="empty-state-text">
                  Click the "Add Link" button or use the form on the right to add your first link
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Add Link Form */}
          <div className="add-link-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Add New Link</h2>
            </div>

            {!modalType ? (
              <div className="sidebar-body">
                <p className="sidebar-description">
                  Choose the type of link you want to add:
                </p>
                <div className="link-type-options">
                  <button
                    className="link-type-button"
                    onClick={() => handleSelectType('social')}
                  >
                    <div className="link-type-icon">
                      <FaInstagram size={32} />
                    </div>
                    <h3 className="link-type-title">Social Media</h3>
                    <p className="link-type-description">
                      Add links to your social media profiles
                    </p>
                  </button>
                  <button
                    className="link-type-button"
                    onClick={() => handleSelectType('project')}
                  >
                    <div className="link-type-icon">
                      <FaGlobe size={32} />
                    </div>
                    <h3 className="link-type-title">Project Link</h3>
                    <p className="link-type-description">
                      Add links to your projects or websites
                    </p>
                  </button>
                </div>
              </div>
            ) : modalType === 'social' ? (
              <div className="sidebar-body">
                <button
                  className="back-button"
                  onClick={() => setModalType(null)}
                >
                  ← Back
                </button>
                <p className="sidebar-description">Select a social media platform:</p>
                <div className="social-grid">
                  {socialMediaOptions.map((social) => {
                    const IconComponent = getIconComponent(social.icon);
                    return (
                      <button
                        key={social.icon}
                        className={`social-option ${
                          selectedSocial === social.icon ? 'selected' : ''
                        }`}
                        onClick={() =>
                          handleSocialSelect(social.name, social.icon)
                        }
                      >
                        <IconComponent
                          size={28}
                          style={{ color: social.color }}
                        />
                        <span className="social-name">{social.name}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedSocial && (
                  <div className="form-section">
                    <label className="form-label">URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                    />
                    <div className="form-buttons">
                      <button className="cancel-button" onClick={handleCancelAdd}>
                        Cancel
                      </button>
                      <button className="save-button" onClick={handleSaveLink}>
                        Save Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="sidebar-body">
                <button
                  className="back-button"
                  onClick={() => setModalType(null)}
                >
                  ← Back
                </button>
                <div className="form-section">
                  <label className="form-label">Link Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., My Portfolio, GitHub Project"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label className="form-label">URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
                <div className="form-buttons">
                  <button className="cancel-button" onClick={handleCancelAdd}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveLink}>
                    Save Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default EditLinks;