'use client';

import React, { useState } from 'react';
import { Heart, User, Calendar, Trash2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { useResource } from '@/lib/use-resource';
import { Favorite } from '@/lib/types';
import { EmptyState } from '@/components/empty-state';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { AddFavoriteModal } from '@/components/add-favorite-modal';

export default function FavoritesPage() {
  const { data: favorites, isLoading, mutate } = useResource<Favorite>('/api/favorites');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);

    // Optimistically remove the row.
    mutate(
      favorites.filter((f) => f.id !== id),
      false
    );

    try {
      const res = await fetch(`/api/favorites?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Request failed');
    } catch (err) {
      console.error('[v0] Delete favorite failed:', err);
    } finally {
      mutate();
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: 'listing_id' as const,
      label: 'Listing',
      render: (value: string) => (
        <p className="font-medium text-foreground">{value}</p>
      ),
      width: '200px',
    },
    {
      key: 'user_id' as const,
      label: 'Favorited By',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'created_at' as const,
      label: 'Added Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {value ? new Date(value).toLocaleDateString() : '—'}
        </div>
      ),
    },
    {
      key: 'id' as const,
      label: 'Action',
      render: (_value: string, row: Favorite) => (
        <button
          onClick={() => handleDelete(row.id)}
          disabled={deletingId === row.id}
          aria-label={`Remove favorite ${row.listing_id}`}
          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (!isLoading && favorites.length === 0) {
    return (
      <div>
        <DashboardHeader
          title="Favorites"
          description="View all favorited vehicles."
          breadcrumbs={[{ label: 'Home' }, { label: 'Favorites' }]}
          action={{ label: 'Add Favorite', onClick: () => setModalOpen(true) }}
        />
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title="No Favorites Yet"
            description="Start adding your favorite vehicles to track them here."
          />
        </div>
        <AddFavoriteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => mutate()}
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Favorites"
        description="View all favorited vehicles."
        breadcrumbs={[{ label: 'Home' }, { label: 'Favorites' }]}
        action={{ label: 'Add Favorite', onClick: () => setModalOpen(true) }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="px-4 sm:px-0">
            <SkeletonLoader variant="table-row" count={5} />
          </div>
        ) : (
          <MobileDataTable<Favorite>
            columns={columns}
            data={favorites}
            searchPlaceholder="Search favorites by vehicle name..."
            rowsPerPage={10}
          />
        )}
      </div>

      <AddFavoriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
