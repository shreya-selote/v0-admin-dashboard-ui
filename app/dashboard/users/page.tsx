'use client';

import React, { useState } from 'react';
import { Mail, Calendar, Pencil, Trash2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { MobileDataTable } from '@/components/mobile-data-table';
import { Badge } from '@/components/badge';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { EmptyState } from '@/components/empty-state';
import { UserModal } from '@/components/user-modal';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useResource } from '@/lib/use-resource';
import { User } from '@/lib/types';

export default function UsersPage() {
  const { data: users, isLoading, isError, mutate } = useResource<User>('/api/users');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    const res = await fetch(`/api/users/${deletingUser.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Failed to delete user');
    }
    setDeletingUser(null);
    mutate();
  };

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
    {
      key: 'id' as const,
      label: 'Actions',
      render: (_value: string, row: User) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(row)}
            aria-label={`Edit ${row.name}`}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingUser(row)}
            aria-label={`Delete ${row.name}`}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
          onClick: openAdd,
        }}
      />

      <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="px-4 sm:px-0">
            <SkeletonLoader variant="table-row" count={5} />
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load users"
            description="There was a problem fetching users from the database. Please try again."
          />
        ) : (
          <MobileDataTable<User>
            columns={columns}
            data={users}
            searchPlaceholder="Search users by name or email..."
            rowsPerPage={10}
          />
        )}
      </div>

      <UserModal
        open={modalOpen}
        user={editingUser}
        onClose={() => setModalOpen(false)}
        onSuccess={() => mutate()}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Delete User"
        description={
          deletingUser
            ? `Are you sure you want to delete ${deletingUser.name}? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
