'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { User } from 'lucide-react';
import { AdminProfile } from '@/lib/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export function AdminProfileForm() {
  const { data, mutate } = useSWR<AdminProfile>('/api/admin/profile', fetcher);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Populate the form once when data first arrives.
  if (data && !initialized) {
    setForm({ name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '' });
    setInitialized(true);
  }

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus('idle');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      const updated = await res.json();
      mutate(updated, false);
      setStatus('success');
    } catch (err) {
      console.error('[v0] Save profile failed:', err);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50';

  return (
    <div className="card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card">
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Admin Profile</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Update your account information
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-foreground mb-1.5">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Alex Johnson"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="alex@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 min-h-10"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {status === 'success' && (
            <span className="text-sm text-green-600 dark:text-green-400">Profile saved.</span>
          )}
          {status === 'error' && (
            <span className="text-sm text-red-600 dark:text-red-400">
              Could not save. Try again.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
