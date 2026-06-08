'use client';

import React, { useState } from 'react';
import { Plus, DollarSign, Gauge } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { vehiclesData } from '@/lib/data/vehicles';
import { Vehicle } from '@/lib/types';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);

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
          onClick: () => alert('Add vehicle functionality to be implemented'),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<Vehicle>
          columns={columns}
          data={vehicles}
          searchPlaceholder="Search vehicles by make, model, or plate..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
