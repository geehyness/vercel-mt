// src/app/profile/page.tsx
"use client";

import { client } from '@/sanity/client';
import { writeClient } from '@/lib/sanity.client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState, useCallback } from 'react';
import { BookOpen, MessagesSquare, Edit, LogOut, Loader2, AlertTriangle, Sparkles, Save, X, CheckCircle } from 'lucide-react';

// Define Sanity User type
export interface SanityUser {
  _id: string;
  _createdAt: string;
  name?: string | null;
  email?: string | null;
  avatar?: { asset?: { url?: string | null } } | null;
  bibleVersion?: string | null;
  testimony?: string | null;
  prayerRequests?: string | null;
  role?: string | null;
}

// UserAvatar Component
interface UserAvatarProps { 
  user: SanityUser | null; 
  size?: number; 
}

function UserAvatar({ user, size = 100 }: UserAvatarProps) {
  const imageUrl = user?.avatar?.asset?.url;
  const name = user?.name;
  const initials = name?.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-purple-200 text-slate-600 overflow-hidden"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name || 'User Avatar'} fill className="object-cover" />
      ) : (
        <span className="font-semibold" style={{ fontSize: `${size * 0.4}px` }}>{initials}</span>
      )}
    </div>
  );
}

interface ProfilePageProps {
  email: string;
}

export default function ProfilePage({ email }: ProfilePageProps) {
  const auth = useAuth();
  const [sanityUser, setSanityUser] = useState<SanityUser | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetchingSanity, setIsFetchingSanity] = useState<boolean>(false);
  const [editingPrayerRequests, setEditingPrayerRequests] = useState(false);
  const [currentPrayerText, setCurrentPrayerText] = useState('');
  const [isSavingPrayer, setIsSavingPrayer] = useState(false);
  const [savePrayerError, setSavePrayerError] = useState<string | null>(null);
  const [savePrayerSuccess, setSavePrayerSuccess] = useState<boolean>(false);

  const fetchSanityUserData = useCallback(async () => {
    if (auth.isAuthenticated && auth.user?._id) {
      setIsFetchingSanity(true);
      setFetchError(null);
      try {
        const fetchedUser = await client.fetch<SanityUser | null>(
          `*[_type == "user" && _id == $id][0]{
            _id, name, email, "avatar": avatar{asset->{url}},
            bibleVersion, testimony, prayerRequests, role
          }`,
          { id: auth.user._id }
        );
        setSanityUser(fetchedUser);
        if (!editingPrayerRequests) {
          setCurrentPrayerText(fetchedUser?.prayerRequests || '');
        }
      } catch (error) {
        console.error('ProfilePage: Failed to fetch Sanity user data:', error);
        setFetchError('Sorry, we couldn\'t load your profile details. Please try again later.');
      } finally {
        setIsFetchingSanity(false);
      }
    } else {
      setIsFetchingSanity(false);
      setSanityUser(null);
      setCurrentPrayerText('');
    }
  }, [auth.isAuthenticated, auth.user?._id, editingPrayerRequests]);

  useEffect(() => {
    if (!auth.loading) {
      fetchSanityUserData();
    }
  }, [auth.loading, fetchSanityUserData]);

  const handleSavePrayerRequests = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!sanityUser?._id || isSavingPrayer) return;

    setIsSavingPrayer(true);
    setSavePrayerError(null);
    setSavePrayerSuccess(false);

    try {
      await writeClient
        .patch(sanityUser._id)
        .set({ prayerRequests: currentPrayerText })
        .commit();

      setSavePrayerSuccess(true);
      setEditingPrayerRequests(false);
      setSanityUser(prevUser => prevUser ? { ...prevUser, prayerRequests: currentPrayerText } : null);
      setTimeout(() => setSavePrayerSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save prayer requests:', error);
      setSavePrayerError('Failed to save prayer requests. Please try again.');
      setTimeout(() => setSavePrayerError(null), 5000);
    } finally {
      setIsSavingPrayer(false);
    }
  };

  const startEditingPrayerRequests = () => {
    setCurrentPrayerText(sanityUser?.prayerRequests || '');
    setEditingPrayerRequests(true);
    setSavePrayerError(null);
    setSavePrayerSuccess(false);
  };

  const cancelEditingPrayerRequests = () => {
    setEditingPrayerRequests(false);
    setSavePrayerError(null);
    setSavePrayerSuccess(false);
  };

  if (auth.loading) {
    return (
      <div className="loading-state state-container">
        <Loader2 className="state-icon animate-spin" />
        <p className="state-message">Loading authentication...</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="auth-state state-container">
        <AlertTriangle className="state-icon" />
        <p className="state-message">Please sign in to view your profile</p>
        <Link href="/signin" className="action-button button-signin">
          Sign In
        </Link>
      </div>
    );
  }

  if (isFetchingSanity && !sanityUser) {
    return (
      <div className="loading-state state-container">
        <Loader2 className="state-icon animate-spin" />
        <p className="state-message">Loading profile details...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="error-state state-container">
        <AlertTriangle className="state-icon" />
        <p className="state-message">{fetchError}</p>
        <button onClick={fetchSanityUserData} className="action-button button-retry">
          Retry
        </button>
      </div>
    );
  }

  if (!isFetchingSanity && !sanityUser && !auth.loading) {
    return (
      <div className="not-found-state state-container">
        <AlertTriangle className="state-icon" />
        <p className="state-message">Profile not found</p>
      </div>
    );
  }

  if (!sanityUser) {
    return (
      <div className="loading-state state-container">
        <Loader2 className="state-icon animate-spin" />
        <p className="state-message">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
       <div className="profile-card">
        <div className="profile-header">
            <div className="profile-avatar-wrapper">
                <UserAvatar user={sanityUser} size={120} />
            </div>
            <div className="profile-info">
                <h1 className="user-name">{sanityUser.name || 'Unnamed User'}</h1>
                <p className="user-email">{sanityUser.email || auth.user?.email || 'No Email Provided'}</p>
                <div className="badge-container">
                    <span className="badge badge-role">{sanityUser.role || auth.user?.role || 'Member'}</span>
                    {sanityUser.bibleVersion && <span className="badge badge-version">{sanityUser.bibleVersion} Reader</span>}
                </div>
                <div className="profile-actions">
            <Link href="/profile/edit" className="action-button button-edit"><Edit className="button-icon" /> Edit Full Profile</Link>
            <button onClick={auth.signOut} className="action-button button-signout"><LogOut className="button-icon" /> Sign Out</button>
          </div>
            </div>
        </div>

        {/* --- Profile Details Section --- */}
        <div className="profile-details">
          {/* Testimony Section (Remains the Same) */}
          {sanityUser.testimony && (
             <div className="detail-section">
                 <div className="detail-title-area"><BookOpen className="detail-icon detail-icon-testimony" /><h2 className="detail-title">My Testimony</h2></div>
                 <div className="detail-content">{sanityUser.testimony}</div>
             </div>
          )}

          {/* --- MODIFIED: Personal Prayer Requests Section (Inline Edit) --- */}
          <div className="detail-section">
            <div className="detail-title-area">
              {/* Title Part */}
              <div className="flex items-center gap-3">
                <MessagesSquare className="detail-icon detail-icon-prayer" />
                <h2 className="detail-title">My Personal Prayer List</h2>
              </div>
              {/* Edit Button (only show if NOT editing) */}
              {!editingPrayerRequests && (
                <button onClick={startEditingPrayerRequests} className="edit-section-button">
                  <Edit className="button-icon" /> Edit
                </button>
              )}
            </div>

            {/* Conditional Rendering: Display Text or Edit Form */}
            {editingPrayerRequests ? (
              // EDITING FORM
              <form onSubmit={handleSavePrayerRequests} className="edit-prayer-form">
                <textarea
                  value={currentPrayerText}
                  onChange={(e) => setCurrentPrayerText(e.target.value)}
                  className="edit-prayer-textarea"
                  placeholder="Enter your personal prayer requests here..."
                  rows={6} // Adjust rows as needed
                  disabled={isSavingPrayer}
                />
                {/* Action buttons and status messages */}
                <div className="edit-prayer-actions">
                  <button
                    type="submit"
                    disabled={isSavingPrayer}
                    className="action-button button-save-prayer"
                  >
                    {isSavingPrayer ? <Loader2 className="button-icon animate-spin" /> : <Save className="button-icon" />}
                    {isSavingPrayer ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditingPrayerRequests}
                    disabled={isSavingPrayer}
                    className="action-button button-cancel-edit"
                  >
                    <X className="button-icon" /> Cancel
                  </button>
                   {/* Status Messages */}
                  {savePrayerSuccess && (
                      <div className="edit-prayer-success-message ml-auto"> {/* ml-auto to push right */}
                            <CheckCircle className="w-4 h-4 mr-1"/> Saved!
                      </div>
                  )}
                  {savePrayerError && (
                      <div className="edit-prayer-error-message ml-auto">
                         <AlertTriangle className="w-4 h-4 mr-1"/> {savePrayerError}
                      </div>
                  )}
                </div>
              </form>
            ) : (
              // DISPLAY TEXT (or placeholder if empty)
              <>
                {sanityUser.prayerRequests ? (
                    <div className="detail-content">{sanityUser.prayerRequests}</div>
                 ) : (
                    <p className="text-slate-500 italic">You have not added any personal prayer requests yet. Click &quot;Edit&quot; to add some.</p>
                 )}
              </>
            )}
          </div>
          {/* --------------------------------------------------------------- */}


          {/* Placeholder (Only show if BOTH testimony AND prayer requests are empty AND NOT editing prayers) */}
          {!sanityUser.testimony && !sanityUser.prayerRequests && !editingPrayerRequests && (
             <div className="placeholder-section">
                <Sparkles className="placeholder-icon" />
                <h3 className="placeholder-title">Share Your Story!</h3>
                <p className="placeholder-text">Your testimony and personal prayer list can be added here.</p>
                <Link href="/profile/edit" className="action-button button-placeholder">
                    <Edit className="button-icon" /> Add Your Details
                </Link>
             </div>
          )}


          {/* Profile Actions (Remains the Same) */}
          
        </div>
      </div>
    </div>
  );
}