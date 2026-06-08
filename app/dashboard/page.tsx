'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Car, AlertCircle } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/badge';
import { useResource } from '@/lib/use-resource';
import { User, Vehicle, Enquiry, Inventory } from '@/lib/types';

const chartData = [
  { month: 'Jan', sales: 4000, enquiries: 2400 },
  { month: 'Feb', sales: 3000, enquiries: 1398 },
  { month: 'Mar', sales: 2000, enquiries: 9800 },
  { month: 'Apr', sales: 2780, enquiries: 3908 },
  { month: 'May', sales: 1890, enquiries: 4800 },
  { month: 'Jun', sales: 2390, enquiries: 3800 },
];

export default function DashboardPage() {
  const { data: usersData } = useResource<User>('/api/users');
  const { data: vehiclesData } = useResource<Vehicle>('/api/vehicles');
  const { data: enquiriesData } = useResource<Enquiry>('/api/enquiries');
  const { data: inventoryData } = useResource<Inventory>('/api/inventory');

  const statusData = [
    { name: 'Available', value: vehiclesData.filter(v => v.status === 'Available').length, color: 'oklch(0.6 0.2 264.36)' },
    { name: 'Sold', value: vehiclesData.filter(v => v.status === 'Sold').length, color: 'oklch(0.5 0.18 27)' },
    { name: 'Pending', value: vehiclesData.filter(v => v.status === 'Pending').length, color: 'oklch(0.65 0.12 180)' },
  ];

  const activeUsers = usersData.filter(u => u.status === 'Active').length;
  const totalVehicles = vehiclesData.length;
  const lowStockItems = inventoryData.filter(i => i.status !== 'In Stock').length;
  const pendingEnquiries = enquiriesData.filter(e => e.status === 'New' || e.status === 'In Progress').length;

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here&apos;s an overview of your vehicle inventory."
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Active Users"
            value={activeUsers}
            subtitle={`${usersData.length ? ((activeUsers / usersData.length) * 100).toFixed(0) : 0}% of total users`}
            trend={{ value: 12, direction: 'up' }}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Total Vehicles"
            value={totalVehicles}
            subtitle="Available in inventory"
            trend={{ value: 5, direction: 'down' }}
            icon={<Car className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            subtitle="Need restocking"
            trend={{ value: 8, direction: 'up' }}
            icon={<AlertCircle className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Pending Enquiries"
            value={pendingEnquiries}
            subtitle="Require attention"
            trend={{ value: 15, direction: 'up' }}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sales & Enquiries Line Chart */}
          <div className="lg:col-span-2 card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
              Sales & Enquiries Trend
            </h3>
            <ResponsiveContainer width="100%" height={200} minHeight={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.12)" />
                <XAxis stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(1 0 0 / 0.12)',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'oklch(0.95 0 0)' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="oklch(0.6 0.2 264.36)"
                  strokeWidth={2}
                  dot={false}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  stroke="oklch(0.5 0.18 27)"
                  strokeWidth={2}
                  dot={false}
                  name="Enquiries"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Vehicle Status Pie Chart */}
          <div className="card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
              Vehicle Status
            </h3>
            <ResponsiveContainer width="100%" height={200} minHeight={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.15 0 0)',
                    border: '1px solid oklch(1 0 0 / 0.12)',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'oklch(0.95 0 0)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Bar Chart */}
        <div className="card-elevated border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Inventory Levels by Location
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={inventoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.12)" />
              <XAxis type="number" stroke="oklch(0.65 0 0)" />
              <YAxis
                type="category"
                dataKey="vehicleName"
                stroke="oklch(0.65 0 0)"
                width={190}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.15 0 0)',
                  border: '1px solid oklch(1 0 0 / 0.12)',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'oklch(0.95 0 0)' }}
              />
              <Bar dataKey="quantity" fill="oklch(0.6 0.2 264.36)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Enquiries
            </h3>
            <div className="space-y-3">
              {enquiriesData.slice(0, 4).map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {enquiry.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enquiry.vehicleName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      enquiry.status === 'New'
                        ? 'error'
                        : enquiry.status === 'In Progress'
                          ? 'warning'
                          : 'success'
                    }
                    size="sm"
                  >
                    {enquiry.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Team Members
            </h3>
            <div className="space-y-3">
              {usersData.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Badge
                    variant={user.status === 'Active' ? 'success' : 'default'}
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
