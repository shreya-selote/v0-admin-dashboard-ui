'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/modal';
import { Enquiry } from '@/lib/types';

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided the modal operates in edit mode. */
  enquiry?: Enquiry | null;
}

interface EnquiryForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleName: string;
  status: Enquiry['status'];
  priority: Enquiry['priority'];
}

const initialForm: EnquiryForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  vehicleName: '',
  status: 'New',
  priority: 'Medium',
};

const STATUS_OPTIONS: Enquiry['status'][] = ['New', 'In Progress', 'Resolved', 'Closed'];
const PRIORITY_OPTIONS: Enquiry['priority'][] = ['Low', 'Medium', 'High'];

export function EnquiryModal({ open, onClose, onSuccess, enquiry }: EnquiryModalProps) {
  const isEdit = Boolean(enquiry);
  const [form, setForm] = useState<EnquiryForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (enquiry) {
      setForm({
        customerName: enquiry.customerName ?? '',
        customerEmail: enquiry.customerEmail ?? '',
        customerPhone: enquiry.customerPhone ?? '',
        vehicleName: enquiry.vehicleName ?? '',
        status: enquiry.status ?? 'New',
        priority: enquiry.priority ?? 'Medium',
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [open, enquiry]);

  const update = (key: keyof EnquiryForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.customerName.trim() || !form.vehicleName.trim()) {
      setError('Customer name and vehicle interest are required.');
      return;
    }
    if (form.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        vehicleName: form.vehicleName.trim(),
        status: form.status,
        priority: form.priority,
        ...(isEdit ? {} : { createdAt: new Date().toISOString() }),
      };

      const res = await fetch(
        isEdit ? `/api/enquiries/${enquiry!.id}` : '/api/enquiries',
        {
          method: isEdit ? 'PATCH' : 'POST',
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
      console.error('[v0] Save enquiry failed:', err);
      setError(err instanceof Error ? err.message : 'Could not save the enquiry. Please try again.');
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
      title={isEdit ? 'Edit Enquiry' : 'New Enquiry'}
      description={isEdit ? 'Update this enquiry\u2019s details.' : 'Log a new customer enquiry.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="enq-name" className="block text-sm font-medium text-foreground mb-1.5">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="enq-name"
              type="text"
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="enq-vehicle" className="block text-sm font-medium text-foreground mb-1.5">
              Vehicle Interest <span className="text-red-500">*</span>
            </label>
            <input
              id="enq-vehicle"
              type="text"
              value={form.vehicleName}
              onChange={(e) => update('vehicleName', e.target.value)}
              placeholder="Toyota Corolla 2024"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="enq-email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="enq-email"
              type="email"
              value={form.customerEmail}
              onChange={(e) => update('customerEmail', e.target.value)}
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="enq-phone" className="block text-sm font-medium text-foreground mb-1.5">
              Phone
            </label>
            <input
              id="enq-phone"
              type="tel"
              value={form.customerPhone}
              onChange={(e) => update('customerPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="enq-status" className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              id="enq-status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="enq-priority" className="block text-sm font-medium text-foreground mb-1.5">
              Priority
            </label>
            <select
              id="enq-priority"
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
              className={inputClass}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
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
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Enquiry'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
