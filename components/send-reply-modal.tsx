'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/modal';

interface SendReplyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm = { enquiryId: '', repliedBy: '', message: '' };

export function SendReplyModal({ open, onClose, onSuccess }: SendReplyModalProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.enquiryId.trim() || !form.message.trim()) {
      setError('Enquiry ID and message are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: form.enquiryId.trim(),
          repliedBy: form.repliedBy.trim() || 'Admin',
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Request failed');
      }
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[v0] Send reply failed:', err);
      setError(err instanceof Error ? err.message : 'Could not send the reply.');
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
      title="Send Reply"
      description="Respond to a customer enquiry."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reply-enquiry" className="block text-sm font-medium text-foreground mb-1.5">
            Enquiry ID <span className="text-red-500">*</span>
          </label>
          <input
            id="reply-enquiry"
            type="text"
            value={form.enquiryId}
            onChange={(e) => update('enquiryId', e.target.value)}
            placeholder="E001"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reply-by" className="block text-sm font-medium text-foreground mb-1.5">
            Replied By
          </label>
          <input
            id="reply-by"
            type="text"
            value={form.repliedBy}
            onChange={(e) => update('repliedBy', e.target.value)}
            placeholder="Admin"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reply-message" className="block text-sm font-medium text-foreground mb-1.5">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reply-message"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Type your reply…"
            rows={4}
            className={inputClass}
          />
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
            {submitting ? 'Sending…' : 'Send Reply'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
