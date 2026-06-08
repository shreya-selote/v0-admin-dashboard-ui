'use client';

import React, { useState } from 'react';
import { Bell, Lock, User, Database, Globe, Zap } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';

interface SettingSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    label: string;
    description?: string;
    toggle?: boolean;
    value?: boolean;
  }>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    dataBackup: true,
    apiAccess: true,
    performanceMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Notifications',
      description: 'Manage how you receive notifications',
      icon: <Bell className="h-6 w-6 text-primary" />,
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          toggle: true,
          value: settings.emailNotifications,
        },
        {
          label: 'Push Notifications',
          description: 'Receive browser push notifications',
          toggle: true,
          value: settings.pushNotifications,
        },
      ],
    },
    {
      title: 'Security',
      description: 'Control your account security settings',
      icon: <Lock className="h-6 w-6 text-primary" />,
      items: [
        {
          label: 'Two-Factor Authentication',
          description: 'Enhance your account security',
          toggle: true,
          value: settings.twoFactorAuth,
        },
        {
          label: 'Password',
          description: 'Change your password',
        },
      ],
    },
    {
      title: 'Data & Privacy',
      description: 'Manage your data and privacy',
      icon: <Database className="h-6 w-6 text-primary" />,
      items: [
        {
          label: 'Automatic Backups',
          description: 'Enable automatic data backups',
          toggle: true,
          value: settings.dataBackup,
        },
        {
          label: 'Data Export',
          description: 'Export your data',
        },
      ],
    },
    {
      title: 'API & Integrations',
      description: 'Manage API keys and integrations',
      icon: <Zap className="h-6 w-6 text-primary" />,
      items: [
        {
          label: 'API Access',
          description: 'Enable API access for your account',
          toggle: true,
          value: settings.apiAccess,
        },
        {
          label: 'Webhooks',
          description: 'Configure webhook endpoints',
        },
      ],
    },
  ];

  return (
    <div>
      <DashboardHeader
        title="Settings"
        description="Manage your account settings and preferences."
        breadcrumbs={[{ label: 'Home' }, { label: 'Settings' }]}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Account Section */}
          <div className="card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Account
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage your account information
                </p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-foreground">Full Name</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Alex Johnson
                  </p>
                </div>
                <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-muted rounded-lg transition-colors whitespace-nowrap min-h-9">
                  Edit
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-foreground">Email</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    alex@example.com
                  </p>
                </div>
                <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-muted rounded-lg transition-colors whitespace-nowrap min-h-9">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          {settingSections.map((section) => (
            <div
              key={section.title}
              className="card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-foreground">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.toggle ? (
                      <button
                        onClick={() =>
                          handleToggle(
                            item.label
                              .toLowerCase()
                              .replace(/\s+/g, '') as keyof typeof settings
                          )
                        }
                        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                          item.value
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-muted rounded-lg transition-colors whitespace-nowrap min-h-9">
                        Configure
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="card-elevated border border-red-500/20 rounded-lg p-4 sm:p-6 bg-red-500/5">
            <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Danger Zone
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Irreversible actions. Proceed with caution.
            </p>
            <button className="px-3 sm:px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors min-h-10">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
