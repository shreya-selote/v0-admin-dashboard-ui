'use client';

import React, { useState } from 'react';
import { Heart, User, Calendar, Trash2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { favoritesData } from '@/lib/data/favorites';
import { Favorite } from '@/lib/types';
import { EmptyState } from '@/components/empty-state';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>(favoritesData);

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
      key: 'userId' as const,
      label: 'Favorited By',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">User {value}</span>
        </div>
      ),
    },
    {
      key: 'addedAt' as const,
      label: 'Added Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'id' as const,
      label: 'Action',
      render: () => (
        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-red-500 dark:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (favorites.length === 0) {
    return (
      <div>
        <DashboardHeader
          title="Favorites"
          description="View all favorited vehicles."
          breadcrumbs={[{ label: 'Home' }, { label: 'Favorites' }]}
        />
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title="No Favorites Yet"
            description="Start adding your favorite vehicles to track them here."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Favorites"
        description="View all favorited vehicles."
        breadcrumbs={[{ label: 'Home' }, { label: 'Favorites' }]}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<Favorite>
          columns={columns}
          data={favorites}
          searchPlaceholder="Search favorites by vehicle name..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
