'use client';

import React, { useState } from 'react';
import { MessageSquare, User, Clock, Trash2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { EmptyState } from '@/components/empty-state';
import { SendReplyModal } from '@/components/send-reply-modal';
import { useResource } from '@/lib/use-resource';
import { EnquiryReply } from '@/lib/types';

export default function RepliesPage() {
  const { data: replies, isLoading, isError, mutate } =
    useResource<EnquiryReply>('/api/replies');
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    mutate(
      replies.filter((r) => r.id !== id),
      false
    );
    try {
      const res = await fetch(`/api/replies/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Request failed');
    } catch (err) {
      console.error('[v0] Delete reply failed:', err);
    } finally {
      mutate();
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: 'enquiryId' as const,
      label: 'Enquiry ID',
      render: (value: string) => (
        <span className="font-mono text-sm font-semibold text-primary">
          #{value}
        </span>
      ),
    },
    {
      key: 'repliedBy' as const,
      label: 'Replied By',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: 'message' as const,
      label: 'Message',
      render: (value: string) => (
        <p className="text-sm text-muted-foreground max-w-md truncate">
          {value}
        </p>
      ),
      width: '350px',
    },
    {
      key: 'timestamp' as const,
      label: 'Time',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {value ? new Date(value).toLocaleString() : '—'}
        </div>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (_value: string, row: EnquiryReply) => (
        <button
          onClick={() => handleDelete(row.id)}
          disabled={deletingId === row.id}
          aria-label={`Delete reply for enquiry ${row.enquiryId}`}
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
        title="Enquiry Replies"
        description="Track all customer enquiry responses."
        breadcrumbs={[{ label: 'Home' }, { label: 'Replies' }]}
        action={{
          label: 'Send Reply',
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
            title="Failed to load replies"
            description="There was a problem fetching replies from the database. Please try again."
          />
        ) : replies.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-8 w-8" />}
            title="No Replies Yet"
            description="Respond to customer enquiries to see replies here."
            action={{ label: 'Send Reply', onClick: () => setModalOpen(true) }}
          />
        ) : (
          <MobileDataTable<EnquiryReply>
            columns={columns}
            data={replies}
            searchPlaceholder="Search replies by enquiry ID or message..."
            rowsPerPage={10}
          />
        )}
      </div>

      <SendReplyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
