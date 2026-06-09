'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/modal';
import { User } from '@/lib/types';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided the modal operates in edit mode. */
  user?: User | null;
}

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  phone: string;
  city: string;
  state: string;
  isVerified: boolean;
}

const initialForm: UserForm = {
  firstName: '',
  lastName: '',
  email: '',
  userType: 'buyer',
  phone: '',
  city: '',
  state: '',
  isVerified: false,
};

export function UserModal({ open, onClose, onSuccess, user }: UserModalProps) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState<UserForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync the form whenever the modal opens or the target user changes.
  useEffect(() => {
    if (!open) return;
    if (user) {
      const [firstName, ...rest] = (user.name ?? '').split(' ');
      setForm({
        firstName: user.firstName ?? firstName ?? '',
        lastName: user.lastName ?? rest.join(' ') ?? '',
        email: user.email ?? '',
        userType: user.userType ?? 'buyer',
        phone: user.phone ?? '',
        city: user.city ?? '',
        state: user.state ?? '',
        isVerified: Boolean(user.isVerified),
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [open, user]);

  const update = (key: keyof UserForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.email.trim()) {
      setError('First name and email are required.');
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        userType: form.userType,
        phone: form.phone.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        isVerified: form.isVerified,
      };

      const res = await fetch(
        isEdit ? `/api/users/${user!.id}` : '/api/users',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Request failed');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('[v0] Save user failed:', err);
      setError(err instanceof Error ? err.message : 'Could not save the user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit User' : 'Add User'}
      description={isEdit ? 'Update this user\u2019s details.' : 'Enter the details of the new user.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user-first" className="block text-sm font-medium text-foreground mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="user-first"
              type="text"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              placeholder="Alex"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="user-last" className="block text-sm font-medium text-foreground mb-1.5">
              Last Name
            </label>
            <input
              id="user-last"
              type="text"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              placeholder="Johnson"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="user-email" className="block text-sm font-medium text-foreground mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="alex@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="user-role" className="block text-sm font-medium text-foreground mb-1.5">
              Role
            </label>
            <select
              id="user-role"
              value={form.userType}
              onChange={(e) => update('userType', e.target.value)}
              className={inputClass}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="user-phone" className="block text-sm font-medium text-foreground mb-1.5">
              Phone
            </label>
            <input
              id="user-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="user-city" className="block text-sm font-medium text-foreground mb-1.5">
              City
            </label>
            <input
              id="user-city"
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="Austin"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="user-state" className="block text-sm font-medium text-foreground mb-1.5">
              State
            </label>
            <input
              id="user-state"
              type="text"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              placeholder="TX"
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/40 cursor-pointer">
          <span className="text-sm font-medium text-foreground">Verified (Active)</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.isVerified}
            onClick={() => update('isVerified', !form.isVerified)}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
              form.isVerified ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                form.isVerified ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors min-h-10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 min-h-10"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
