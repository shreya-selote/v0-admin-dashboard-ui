'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/modal';

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface VehicleForm {
  make: string;
  model: string;
  year: string;
  price: string;
  color: string;
  licensePlate: string;
}

const initialForm: VehicleForm = {
  make: '',
  model: '',
  year: '',
  price: '',
  color: '',
  licensePlate: '',
};

export function AddVehicleModal({ open, onClose, onSuccess }: AddVehicleModalProps) {
  const [form, setForm] = useState<VehicleForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof VehicleForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.make.trim() || !form.model.trim() || !form.price.trim()) {
      setError('Make, Model, and Price are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: form.make.trim(),
          model: form.model.trim(),
          year: form.year ? Number(form.year) : new Date().getFullYear(),
          price: Number(form.price) || 0,
          color: form.color.trim() || 'Unspecified',
          licensePlate: form.licensePlate.trim() || 'N/A',
          vin: `VIN${Date.now()}`,
          mileage: 0,
          status: 'Available',
          fuelType: 'Petrol',
          transmission: 'Automatic',
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[v0] Add vehicle failed:', err);
      setError('Could not add the vehicle. Please try again.');
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
      title="Add Vehicle"
      description="Enter the details of the new vehicle."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-foreground mb-1.5">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              id="make"
              type="text"
              value={form.make}
              onChange={(e) => update('make', e.target.value)}
              placeholder="Toyota"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-foreground mb-1.5">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              id="model"
              type="text"
              value={form.model}
              onChange={(e) => update('model', e.target.value)}
              placeholder="Corolla"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-1.5">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="25000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-foreground mb-1.5">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) => update('year', e.target.value)}
              placeholder="2024"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-foreground mb-1.5">
              Color
            </label>
            <input
              id="color"
              type="text"
              value={form.color}
              onChange={(e) => update('color', e.target.value)}
              placeholder="White"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-foreground mb-1.5">
              License Plate
            </label>
            <input
              id="plate"
              type="text"
              value={form.licensePlate}
              onChange={(e) => update('licensePlate', e.target.value)}
              placeholder="ABC-1234"
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
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
