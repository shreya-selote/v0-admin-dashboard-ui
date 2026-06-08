'use client';

import React, { useState } from 'react';
import { DollarSign, Gauge } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { EmptyState } from '@/components/empty-state';
import { AddVehicleModal } from '@/components/add-vehicle-modal';
import { useResource } from '@/lib/use-resource';
import { Vehicle } from '@/lib/types';

export default function VehiclesPage() {
  const { data: vehicles, isLoading, isError, mutate } = useResource<Vehicle>('/api/vehicles');
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    {
      key: 'model' as const,
      label: 'Vehicle',
      render: (_value: string, row: Vehicle) => (
        <div>
          <p className="font-medium text-foreground">
            {row.year} {row.make} {row.model}
          </p>
          <p className="text-xs text-muted-foreground">{row.vin}</p>
        </div>
      ),
      width: '200px',
    },
    {
      key: 'licensePlate' as const,
      label: 'License Plate',
      render: (value: string) => (
        <span className="font-mono text-sm font-semibold">{value}</span>
      ),
    },
    {
      key: 'color' as const,
      label: 'Color',
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'price' as const,
      label: 'Price',
      render: (value: number) => (
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <DollarSign className="h-4 w-4 text-primary" />
          ${value.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'mileage' as const,
      label: 'Mileage',
      render: (value: number) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gauge className="h-4 w-4" />
          {value.toLocaleString()} miles
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'Available'
              ? 'success'
              : value === 'Sold'
                ? 'error'
                : 'warning'
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
        title="Vehicles"
        description="Manage your vehicle inventory and details."
        breadcrumbs={[{ label: 'Home' }, { label: 'Vehicles' }]}
        action={{
          label: 'Add Vehicle',
          onClick: () => setModalOpen(true),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="px-4 sm:px-0">
            <SkeletonLoader variant="table-row" count={5} />
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load vehicles"
            description="There was a problem fetching vehicles from the database. Please try again."
          />
        ) : (
          <MobileDataTable<Vehicle>
            columns={columns}
            data={vehicles}
            searchPlaceholder="Search vehicles by make, model, or plate..."
            rowsPerPage={10}
          />
        )}
      </div>

      <AddVehicleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
