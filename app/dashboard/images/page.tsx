'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Calendar, Trash2, Star, Upload } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { EmptyState } from '@/components/empty-state';
import { useResource } from '@/lib/use-resource';
import { Image } from '@/lib/types';

export default function ImagesPage() {
  const { data: images, isLoading, isError, mutate } = useResource<Image>('/api/images');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUploadClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const listingId = window.prompt('Enter the listing ID for this image:');
    if (!listingId) {
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('listing_id', listingId);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Upload failed');
      }
      mutate();
    } catch (err) {
      console.error('[v0] Upload image failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    mutate(
      images.filter((img) => img.id !== id),
      false
    );
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Request failed');
    } catch (err) {
      console.error('[v0] Delete image failed:', err);
    } finally {
      mutate();
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: 'image_url' as const,
      label: 'Preview',
      render: (value: string) => (
        <div className="h-12 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value || '/placeholder.svg'}
              alt="Vehicle"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
      width: '90px',
    },
    {
      key: 'listing_id' as const,
      label: 'Listing ID',
      render: (value: string) => (
        <span className="font-mono text-sm font-semibold text-primary">
          {value}
        </span>
      ),
    },
    {
      key: 'is_thumbnail' as const,
      label: 'Type',
      render: (value: boolean) =>
        value ? (
          <Badge variant="info" size="sm">
            <Star className="h-3 w-3 mr-1 inline" /> Thumbnail
          </Badge>
        ) : (
          <Badge variant="default" size="sm">
            Gallery
          </Badge>
        ),
    },
    {
      key: 'createdAt' as const,
      label: 'Added',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {value ? new Date(value).toLocaleDateString() : '—'}
        </div>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (_value: string, row: Image) => (
        <button
          onClick={() => handleDelete(row.id)}
          disabled={deletingId === row.id}
          aria-label={`Delete image ${row.listing_id}`}
          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
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
          label: uploading ? 'Uploading…' : 'Upload Images',
          onClick: handleUploadClick,
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {uploadError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {uploadError}
          </p>
        )}

        {isLoading ? (
          <SkeletonLoader variant="table-row" count={5} />
        ) : isError ? (
          <EmptyState
            title="Failed to load images"
            description="There was a problem fetching images from the database. Please try again."
          />
        ) : images.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-8 w-8" />}
            title="No Images Yet"
            description="Upload vehicle images to start building your gallery."
            action={{
              label: 'Upload Images',
              onClick: handleUploadClick,
            }}
          />
        ) : (
          <MobileDataTable<Image>
            columns={columns}
            data={images}
            searchPlaceholder="Search images by listing ID..."
            rowsPerPage={10}
          />
        )}
      </div>
    </div>
  );
}
