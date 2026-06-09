'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/modal';
import { Notification } from '@/lib/types';

interface CreateNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface NotificationForm {
  title: string;
  message: string;
  type: Notification['type'];
  actionUrl: string;
}

const initialForm: NotificationForm = {
  title: '',
  message: '',
  type: 'Info',
  actionUrl: '',
};

const TYPE_OPTIONS: Notification['type'][] = ['Info', 'Success', 'Warning', 'Error'];

export function CreateNotificationModal({ open, onClose, onSuccess }: CreateNotificationModalProps) {
  const [form, setForm] = useState<NotificationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
    setError(null);
  }, [open]);

  const update = (key: keyof NotificationForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          actionUrl: form.actionUrl.trim() || undefined,
          read: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Request failed');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('[v0] Create notification failed:', err);
      setError(err instanceof Error ? err.message : 'Could not create the notification. Please try again.');
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
      title="New Notification"
      description="Create a notification to broadcast to the dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notif-title" className="block text-sm font-medium text-foreground mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="notif-title"
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="New feature available"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="notif-message" className="block text-sm font-medium text-foreground mb-1.5">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="notif-message"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Describe the notification…"
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="notif-type" className="block text-sm font-medium text-foreground mb-1.5">
              Type
            </label>
            <select
              id="notif-type"
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className={inputClass}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notif-action" className="block text-sm font-medium text-foreground mb-1.5">
              Action URL
            </label>
            <input
              id="notif-action"
              type="text"
              value={form.actionUrl}
              onChange={(e) => update('actionUrl', e.target.value)}
              placeholder="/dashboard/..."
              className={inputClass}
            />
          </div>
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
            {submitting ? 'Creating…' : 'Create Notification'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
