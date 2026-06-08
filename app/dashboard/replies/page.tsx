'use client';

import React, { useState } from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { enquiryRepliesData } from '@/lib/data/replies';
import { EnquiryReply } from '@/lib/types';

export default function RepliesPage() {
  const [replies, setReplies] = useState<EnquiryReply[]>(enquiryRepliesData);

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
          {new Date(value).toLocaleString()}
        </div>
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
          onClick: () =>
            alert('Send reply functionality to be implemented'),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<EnquiryReply>
          columns={columns}
          data={replies}
          searchPlaceholder="Search replies by enquiry ID or message..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
