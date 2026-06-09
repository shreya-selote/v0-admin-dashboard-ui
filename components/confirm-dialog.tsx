'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** When true the confirm button uses the destructive (red) styling. */
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = false,
}: ConfirmDialogProps) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setWorking(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('[v0] Confirm action failed:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  const handleClose = () => {
    if (working) return;
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} description={description}>
      <div className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={working}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-60 min-h-10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={working}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60 min-h-10 ${
              destructive
                ? 'bg-red-600 text-white'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {working ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
