'use client';

import React from 'react';
import { MapPin, Package } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { useResource } from '@/lib/use-resource';
import { Inventory } from '@/lib/types';

export default function InventoryPage() {
  const { data: inventory } = useResource<Inventory>('/api/inventory');

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
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">{value} units</span>
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
        action={{
          label: 'Update Stock',
          onClick: () =>
            alert('Update stock functionality to be implemented'),
        }}
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
