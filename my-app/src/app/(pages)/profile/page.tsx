'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../components/dashboard/dashboard';
import './page.css';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { FaUser, FaEnvelope, FaGlobe, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/user?userId=${user?.id}`);
      const userData = response.data.user[0];
      setUserProfile(userData);
      setUsername(userData?.username || '');
      setBio(userData?.bio || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setUsernameError('Username cannot be empty');
      setUsernameAvailable(null);
      return;
    }

    // If username hasn't changed, don't check
    if (usernameToCheck === userProfile?.username) {
      setUsernameAvailable(true);
      setUsernameError('');
      return;
    }

    setCheckingUsername(true);
    setUsernameError('');
    
    try {
      const response = await axios.post('/api/check-username', {
        username: usernameToCheck,
      });
      
      if (response.data.available) {
        setUsernameAvailable(true);
        setUsernameError('');
      } else {
        setUsernameAvailable(false);
        setUsernameError('Username is already taken');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    setUsernameAvailable(null);
    setUsernameError('');
  };

  const handleUsernameBlur = () => {
    if (username.trim() && username !== userProfile?.username) {
      checkUsernameAvailability(username);
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }

    // Check availability before saving
    if (username !== userProfile?.username && !usernameAvailable) {
      await checkUsernameAvailability(username);
      // Wait a moment for the check to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // If username is still not available after check, don't save
    if (username !== userProfile?.username && usernameAvailable === false) {
      return;
    }

    setSaving(true);
    try {
      await axios.put('/api/user', {
        clerkUserId: user?.id,
        username,
      });
      setUserProfile({ ...userProfile, username });
      setIsEditingUsername(false);
      setUsernameAvailable(null);
      setUsernameError('');
    } catch (error: any) {
      console.error('Error updating username:', error);
      setUsernameError(error.response?.data?.message || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBio = async () => {
    if (bio.length > 80) {
      alert('Bio must be 80 characters or less');
      return;
    }

    setSaving(true);
    try {
      await axios.put('/api/bio', {
        clerkUserId: user?.id,
        bio,
      });
      setUserProfile({ ...userProfile, bio });
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelUsername = () => {
    setUsername(userProfile?.username || '');
    setIsEditingUsername(false);
    setUsernameAvailable(null);
    setUsernameError('');
  };

  const handleCancelBio = () => {
    setBio(userProfile?.bio || '');
    setIsEditingBio(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Dashboard>
        <div className="profile-container">
          <div className="profile-loading">
            <p>Loading profile...</p>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="profile-container">
        <div className="profile-wrapper">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-avatar-section">
              <div 
                className="profile-avatar-large"
                style={{
                  backgroundImage: user?.imageUrl ? `url(${user.imageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!user?.imageUrl && <FaUser />}
              </div>
              <div className="profile-header-info">
                <h1 className="profile-name">{user?.fullName || userProfile?.name}</h1>
                <p className="profile-email">
                  <FaEnvelope className="profile-icon" />
                  {user?.primaryEmailAddress?.emailAddress || userProfile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="profile-details-card">
            <h2 className="profile-section-title">Profile Information</h2>
            
            {/* Username Section */}
            <div className="profile-field">
              <label className="profile-label">
                <FaUser className="profile-icon" />
                Username
              </label>
              {!isEditingUsername ? (
                <div className="profile-value-row">
                  <span className="profile-value">{username || 'Not set'}</span>
                  <button 
                    className="profile-edit-btn"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
              ) : (
                <div className="profile-edit-section">
                  <div className="profile-input-wrapper">
                    <input
                      type="text"
                      className={`profile-input ${usernameError ? 'profile-input-error' : ''} ${usernameAvailable === true ? 'profile-input-success' : ''}`}
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      onBlur={handleUsernameBlur}
                      placeholder="Enter username"
                      disabled={saving || checkingUsername}
                    />
                    {checkingUsername && (
                      <span className="profile-input-status">Checking...</span>
                    )}
                    {!checkingUsername && usernameAvailable === true && username !== userProfile?.username && (
                      <span className="profile-input-status profile-status-success">✓ Available</span>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <span className="profile-input-status profile-status-error">✗ Taken</span>
                    )}
                  </div>
                  {usernameError && (
                    <p className="profile-error-message">{usernameError}</p>
                  )}
                  <div className="profile-edit-actions">
                    <button 
                      className="profile-save-btn"
                      onClick={handleSaveUsername}
                      disabled={saving || checkingUsername || (username !== userProfile?.username && usernameAvailable === false)}
                    >
                      <FaSave /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      className="profile-cancel-btn"
                      onClick={handleCancelUsername}
                      disabled={saving || checkingUsername}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="profile-field">
              <label className="profile-label">
                <FaGlobe className="profile-icon" />
                Bio
              </label>
              {!isEditingBio ? (
                <div className="profile-value-row">
                  <span className="profile-value">{bio || 'No bio added yet'}</span>
                  <button 
                    className="profile-edit-btn"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
              ) : (
                <div className="profile-edit-section">
                  <textarea
                    className="profile-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself (max 80 characters)"
                    maxLength={80}
                    rows={3}
                    disabled={saving}
                  />
                  <div className="profile-bio-footer">
                    <span className="profile-char-count">{bio.length}/80</span>
                    <div className="profile-edit-actions">
                      <button 
                        className="profile-save-btn"
                        onClick={handleSaveBio}
                        disabled={saving}
                      >
                        <FaSave /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className="profile-cancel-btn"
                        onClick={handleCancelBio}
                        disabled={saving}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Info Section */}
            <div className="profile-field">
              <label className="profile-label">
                <FaCalendar className="profile-icon" />
                Member Since
              </label>
              <div className="profile-value-row">
                <span className="profile-value">
                  {formatDate(userProfile?.created_at)}
                </span>
              </div>
            </div>

            {/* Provider Section */}
            <div className="profile-field">
              <label className="profile-label">
                <FaGlobe className="profile-icon" />
                Sign-in Method
              </label>
              <div className="profile-value-row">
                <span className="profile-value profile-provider">
                  {userProfile?.provider || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default ProfilePage;