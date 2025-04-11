// src/app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/client'; // Adjust path if needed
// Use the more specific User type if available from schema file
// import { User } from '@/sanity/schemas/user';
import { writeClient } from '@/lib/sanity.client';
import UserAvatar from '@/components/UserAvatar'; // Adjust path if needed
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Define User type (ensure structure matches fetched data)
interface User {
  _id: string;
  name?: string | null;
  email?: string | null; // Fetch email for display/confirmation if needed
  avatar?: { asset?: { url?: string | null } } | null;
  testimony?: string | null;
  prayerRequests?: string | null;
  bibleVersion?: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Loading initial profile data
  const [error, setError] = useState<string | null>(null); // Error during initial fetch or save
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    testimony: '',
    prayerRequests: '',
    bibleVersion: 'NIV',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Tracks form submission

  useEffect(() => {
    const fetchUser = async () => {
        setLoading(true); setError(null);
        try {
            const response = await fetch('/api/auth/session');
            if (!response.ok) {
                if (response.status === 401) { router.push('/auth/signin?redirect=/profile/edit'); return; }
                throw new Error(`Failed to fetch session: ${response.statusText}`);
            }
            const session = await response.json();
            if (!session?.user?._id) { console.error("Session missing user ID"); router.push('/auth/signin'); return; }
            const userId = session.user._id;

            const userData = await client.fetch<User | null>(
                `*[_type == "user" && _id == $id][0]{
                    _id, name, email, "avatar": avatar{asset->{url}},
                    testimony, prayerRequests, bibleVersion
                }`,
                { id: userId }
            );

            if (!userData) { setError('User profile data not found in database.'); setLoading(false); return; }

            setUser(userData);
            setFormData({
                name: userData.name || '',
                testimony: userData.testimony || '',
                prayerRequests: userData.prayerRequests || '',
                bibleVersion: userData.bibleVersion || 'NIV',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile data.');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id || isSubmitting) return;

    setIsSubmitting(true); setError(null);
    try {
        await writeClient.patch(user._id).set({
            name: formData.name,
            testimony: formData.testimony,
            prayerRequests: formData.prayerRequests,
            bibleVersion: formData.bibleVersion,
        }).commit();
        router.push('/profile');
        router.refresh(); // Consider removing if patch updates local state sufficiently
    } catch (err) {
        console.error('Profile update failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // ---- Render Logic ----

  if (loading) {
    return (
      <div className="edit-profile-loading-container state-container"> {/* Use state container base */}
        <Loader2 className="state-icon" /> {/* Use state-icon class */}
        {/* Optional: Add title/message */}
      </div>
    );
  }

  // Use error state for fetch errors *before* checking user
  if (error && !user) { // Show fatal error if user couldn't be loaded at all
      return (
       <div className="edit-profile-error-container state-container">
        <AlertTriangle className="state-icon" />
        <h2 className="state-title">Error Loading Profile</h2>
        <p className="state-message state-message-emphasis">{error}</p>
        <div className="state-actions">
           <Link href="/profile" className="action-button button-edit"> {/* Re-use button style */}
                Back to Profile
            </Link>
        </div>
      </div>
    );
  }


  if (!user) { // If loading finished, no major error, but still no user (e.g., not found)
    return (
      <div className="edit-profile-error-container state-container"> {/* Reuse error container styling or create notfound */}
        {/* Optional: use Info icon instead */}
        <h2 className="state-title">Profile Data Not Found</h2>
         <p className="state-message">Could not load user profile.</p>
        <div className="state-actions">
           <Link href="/profile" className="action-button button-edit">
               Back to Profile
            </Link>
        </div>
      </div>
    );
  }

  // Main Edit Form
  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card"> {/* Use new card class */}
        <h1 className="edit-profile-title">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="edit-profile-form">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="profile-avatar-wrapper"> {/* Ensure UserAvatar is wrapped */}
                 <UserAvatar user={user} size={120} />
              </div>
              <button
                type="button"
                className="change-avatar-button"
                onClick={() => { alert("Avatar upload not implemented."); }}
              >
                Change profile picture (coming soon)
              </button>
            </div>

            {/* Form Fields */}
            <div className="form-section">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="form-input" // Use CSS class
                required
              />
            </div>

            <div className="form-section">
              <label htmlFor="bibleVersion" className="form-label">Preferred Bible Version</label>
              <select
                id="bibleVersion"
                name="bibleVersion"
                value={formData.bibleVersion}
                onChange={handleChange}
                className="form-select" // Use CSS class
              >
                <option value="NIV">NIV (New International Version)</option>
                <option value="ESV">ESV (English Standard Version)</option>
                <option value="KJV">KJV (King James Version)</option>
                <option value="NKJV">NKJV (New King James Version)</option>
                <option value="NASB">NASB (New American Standard Bible)</option>
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="testimony" className="form-label">My Testimony</label>
              <textarea
                id="testimony"
                name="testimony"
                value={formData.testimony}
                onChange={handleChange}
                className="form-textarea" // Use CSS class
                placeholder="Share how Christ has worked in your life..."
              />
            </div>

            <div className="form-section">
              <label htmlFor="prayerRequests" className="form-label">My Personal Prayer Requests</label>
              <textarea
                id="prayerRequests"
                name="prayerRequests"
                value={formData.prayerRequests}
                onChange={handleChange}
                className="form-textarea form-textarea-short" // Use CSS class + variant
                placeholder="List your personal prayer items..."
              />
            </div>

             {/* Display Save Error Message if exists */}
             {error && (
                <div className="form-error-message">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0"/> {error}
                </div>
             )}


            {/* Submit/Cancel Buttons */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="action-button button-save-changes" // Use specific class
              >
                {isSubmitting && <Loader2 className="button-icon animate-spin" />} {/* Reuse icon class */}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                disabled={isSubmitting}
                className="action-button button-cancel-form" // Use specific class
              >
                Cancel
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}