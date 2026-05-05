'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';

interface Profile {
  full_name: string | null;
  email: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [profileToast, setProfileToast] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordToast, setPasswordToast] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? '');
      }
    }
    loadProfile();
  }, [router]);

  function showToast(setter: (v: string) => void, msg: string) {
    setter(msg);
    setTimeout(() => setter(''), 3000);
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id);
    }
    setProfileLoading(false);
    showToast(setProfileToast, 'Profile updated');
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    showToast(setPasswordToast, 'Password updated');
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>My Account</h1>

      {/* Profile card */}
      <div className={styles.card}>
        <p className={styles.cardLabel}>Profile</p>
        <h2 className={styles.cardHeading}>Account Details</h2>

        {profileToast && <div className={styles.toast}>{profileToast}</div>}

        <form onSubmit={handleProfileSave}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className={styles.input}
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${styles.inputDisabled}`}
              value={profile?.email ?? ''}
              readOnly
              disabled
            />
            <p className={styles.inputNote}>Email cannot be changed</p>
          </div>

          <button type="submit" disabled={profileLoading} className={styles.saveBtn}>
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password card */}
      <div className={styles.cardSoft}>
        <p className={styles.cardLabel}>Security</p>
        <h2 className={styles.cardHeading}>Change Password</h2>

        {passwordToast && <div className={styles.toast}>{passwordToast}</div>}

        <form onSubmit={handlePasswordSave}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              className={styles.input}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={styles.input}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {passwordError && <p className={styles.fieldError}>{passwordError}</p>}
          </div>

          <button type="submit" disabled={passwordLoading} className={styles.saveBtn}>
            {passwordLoading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <p className={styles.dangerLabel}>Danger Zone</p>
      <div className={styles.dangerCard}>
        <div className={styles.dangerText}>
          <p className={styles.dangerTitle}>Sign out of all devices</p>
          <p className={styles.dangerDesc}>This will sign you out everywhere.</p>
        </div>
        <button className={styles.dangerBtn} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
