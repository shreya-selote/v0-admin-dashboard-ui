'use client';

import React, { useState } from 'react';
import { Plus, Mail, Phone, AlertCircle } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { enquiriesData } from '@/lib/data/enquiries';
import { Enquiry } from '@/lib/types';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(enquiriesData);

  const columns = [
    {
      key: 'customerName' as const,
      label: 'Customer',
      render: (value: string, row: Enquiry) => (
        <div>
          <p className="font-medium text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Mail className="h-3 w-3" /> {row.customerEmail}
          </p>
        </div>
      ),
      width: '220px',
    },
    {
      key: 'vehicleName' as const,
      label: 'Vehicle Interest',
      render: (value: string) => (
        <p className="text-sm text-foreground">{value}</p>
      ),
    },
    {
      key: 'customerPhone' as const,
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      key: 'priority' as const,
      label: 'Priority',
      render: (value: string) => (
        <Badge
          variant={
            value === 'High'
              ? 'error'
              : value === 'Medium'
                ? 'warning'
                : 'default'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'New'
              ? 'error'
              : value === 'In Progress'
                ? 'warning'
                : value === 'Resolved'
                  ? 'success'
                  : 'default'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Enquiries"
        description="Manage customer enquiries and follow-ups."
        breadcrumbs={[{ label: 'Home' }, { label: 'Enquiries' }]}
        action={{
          label: 'New Enquiry',
          onClick: () =>
            alert('New enquiry functionality to be implemented'),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<Enquiry>
          columns={columns}
          data={enquiries}
          searchPlaceholder="Search enquiries by customer name or vehicle..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
