'use client';

import React, { useState } from 'react';
import { Check, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Badge } from '@/components/badge';
import { notificationsData } from '@/lib/data/notifications';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Success':
        return 'success';
      case 'Error':
        return 'error';
      case 'Warning':
        return 'warning';
      case 'Info':
      default:
        return 'info';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <DashboardHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
            : 'All caught up!'
        }
        breadcrumbs={[{ label: 'Home' }, { label: 'Notifications' }]}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-2xl">
        <div className="space-y-2 sm:space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`card-elevated border border-border rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4 transition-all ${
                  !notification.read
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={getBadgeVariant(notification.type)} size="sm" className="w-fit">
                      {notification.type}
                    </Badge>
                  </div>

                  {notification.actionUrl && (
                    <button className="mt-2 sm:mt-3 px-3 py-1.5 text-xs sm:text-sm bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition-opacity min-h-8">
                      View
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors min-h-8 min-w-8"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors min-h-8 min-w-8"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
