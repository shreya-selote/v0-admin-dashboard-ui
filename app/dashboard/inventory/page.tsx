'use client';

import React, { useState } from 'react';
import { MapPin, Package, Minus, Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { useResource } from '@/lib/use-resource';
import { Inventory } from '@/lib/types';

export default function InventoryPage() {
  const { data: inventory, mutate } = useResource<Inventory>('/api/inventory');
  // Track which row is currently being updated to disable its buttons.
  const [pendingId, setPendingId] = useState<string | null>(null);

  const adjustStock = async (item: Inventory, delta: number) => {
    if (pendingId) return;
    if (delta < 0 && item.quantity <= 0) return;
    setPendingId(item.id);

    // Optimistically update the UI before the request resolves.
    const optimistic = inventory.map((row) =>
      row.id === item.id
        ? { ...row, quantity: Math.max(0, row.quantity + delta) }
        : row
    );
    mutate(optimistic, false);

    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, delta }),
      });
      if (!res.ok) throw new Error('Request failed');
    } catch (err) {
      console.error('[v0] Stock adjustment failed:', err);
    } finally {
      // Revalidate against the server to get the authoritative value/status.
      mutate();
      setPendingId(null);
    }
  };

  const columns = [
    {
      key: 'vehicleName' as const,
      label: 'Vehicle',
      render: (value: string) => (
        <p className="font-medium text-foreground">{value}</p>
      ),
      width: '250px',
    },
    {
      key: 'location' as const,
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      key: 'quantity' as const,
      label: 'Quantity',
      render: (value: number, row: Inventory) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustStock(row, -1)}
            disabled={pendingId === row.id || value <= 0}
            aria-label={`Decrease stock for ${row.vehicleName}`}
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 min-w-20 justify-center">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground tabular-nums">
              {value} units
            </span>
          </div>
          <button
            onClick={() => adjustStock(row, 1)}
            disabled={pendingId === row.id}
            aria-label={`Increase stock for ${row.vehicleName}`}
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ),
    },
    {
      key: 'lastUpdated' as const,
      label: 'Last Updated',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Stock Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'In Stock'
              ? 'success'
              : value === 'Low Stock'
                ? 'warning'
                : 'error'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Inventory"
        description="Track vehicle stock levels and locations."
        breadcrumbs={[{ label: 'Home' }, { label: 'Inventory' }]}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<Inventory>
          columns={columns}
          data={inventory}
          searchPlaceholder="Search inventory by vehicle name or location..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
