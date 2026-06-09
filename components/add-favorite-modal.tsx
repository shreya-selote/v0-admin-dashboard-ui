'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/modal';
import { useResource } from '@/lib/use-resource';
import { User, Vehicle } from '@/lib/types';

interface AddFavoriteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FavoriteForm {
  user_id: string;
  listing_id: string;
}

const initialForm: FavoriteForm = { user_id: '', listing_id: '' };

export function AddFavoriteModal({ open, onClose, onSuccess }: AddFavoriteModalProps) {
  // Reuse existing relationships: pick from real users and vehicles.
  const { data: users } = useResource<User>('/api/users');
  const { data: vehicles } = useResource<Vehicle>('/api/vehicles');

  const [form, setForm] = useState<FavoriteForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
    setError(null);
  }, [open]);

  const update = (key: keyof FavoriteForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.user_id.trim() || !form.listing_id.trim()) {
      setError('Please select both a user and a vehicle.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favorite_id: `FAV${Date.now()}`,
          user_id: form.user_id,
          listing_id: form.listing_id,
          created_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Request failed');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('[v0] Add favorite failed:', err);
      setError(err instanceof Error ? err.message : 'Could not add the favorite. Please try again.');
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
      title="Add Favorite"
      description="Mark a vehicle as a favorite for a user."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fav-user" className="block text-sm font-medium text-foreground mb-1.5">
            User <span className="text-red-500">*</span>
          </label>
          <select
            id="fav-user"
            value={form.user_id}
            onChange={(e) => update('user_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Select a user…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fav-vehicle" className="block text-sm font-medium text-foreground mb-1.5">
            Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            id="fav-vehicle"
            value={form.listing_id}
            onChange={(e) => update('listing_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Select a vehicle…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} {v.year}
              </option>
            ))}
          </select>
        </div>

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
            {submitting ? 'Adding…' : 'Add Favorite'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
