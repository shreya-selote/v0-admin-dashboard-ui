'use client';

import React, { useState } from 'react';
import { Plus, Mail, Calendar } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { usersData } from '@/lib/data/users';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(usersData);

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      render: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {row.email}
            </p>
          </div>
        </div>
      ),
      width: '250px',
    },
    {
      key: 'role' as const,
      label: 'Role',
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : 'default'} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'joinDate' as const,
      label: 'Join Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Users"
        description="Manage team members and their access levels."
        breadcrumbs={[{ label: 'Home' }, { label: 'Users' }]}
        action={{
          label: 'Add User',
          onClick: () => alert('Add user functionality to be implemented'),
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MobileDataTable<User>
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name or email..."
          rowsPerPage={10}
        />
      </div>
    </div>
  );
}
