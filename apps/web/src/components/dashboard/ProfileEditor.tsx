'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/store/authStore';
import api from '@/lib/api';

export function ProfileEditor() {
  const { user, token, login } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName || '');
    setPhone(user?.phone || '');
  }, [user]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !token) return;
    setSaving(true);
    try {
      await api.patch(`/users/${user.id}`, { fullName: fullName.trim(), phone: phone.trim() || null });
      login(token, { ...user, fullName: fullName.trim(), phone: phone.trim() });
      toast.success('Profile updated.');
    } catch {
      toast.error('Unable to update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-gray-500">Manage your personal contact information.</p>
      </div>
      <form onSubmit={save} className="card space-y-4">
        <div>
          <label htmlFor="profile-name" className="label">Full name</label>
          <input id="profile-name" className="input" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={150} />
        </div>
        <div>
          <label htmlFor="profile-email" className="label">Email</label>
          <input id="profile-email" className="input bg-gray-50" value={user.email} readOnly />
          <p className="mt-1 text-xs text-gray-500">Contact an administrator to change your email address.</p>
        </div>
        <div>
          <label htmlFor="profile-phone" className="label">Phone</label>
          <input id="profile-phone" className="input" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} />
        </div>
        <div>
          <label className="label">Role</label>
          <input className="input bg-gray-50 capitalize" value={user.role.replaceAll('_', ' ')} readOnly />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
