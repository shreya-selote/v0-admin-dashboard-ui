'use client';

import React, { useState } from 'react';
import { Plus, Upload, Calendar } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { imagesData } from '@/lib/data/images';
import { Image } from '@/lib/types';

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>(imagesData);

  const columns = [
    {
      key: 'vehicleName' as const,
      label: 'Vehicle',
      render: (value: string) => (
        <p className="font-medium text-foreground">{value}</p>
      ),
      width: '200px',
    },
    {
      key: 'type' as const,
      label: 'Type',
      render: (value: string) => (
        <Badge
          variant={
            value === 'Exterior'
              ? 'info'
              : value === 'Interior'
                ? 'secondary'
                : 'default'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'uploadedBy' as const,
      label: 'Uploaded By',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'uploadedAt' as const,
      label: 'Uploaded Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'url' as const,
      label: 'Actions',
      render: () => (
        <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded text-sm font-medium transition-colors">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Images"
        description="Manage vehicle photos and documentation."
        breadcrumbs={[{ label: 'Home' }, { label: 'Images' }]}
        action={{
          label: 'Upload Images',
          onClick: () =>
            alert('Upload images functionality to be implemented'),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<Image>
          columns={columns}
          data={images}
          searchPlaceholder="Search images by vehicle name or type..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
