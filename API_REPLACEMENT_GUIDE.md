# API Replacement Guide

This document provides instructions for replacing the dummy data with real API responses.

## Dummy Data Structure

All dummy data is stored in `/lib/data/` directory with TypeScript types in `/lib/types.ts`.

### Files and Types

#### 1. Users (`/lib/data/users.ts`)
**Type:** `User`
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  status: 'Active' | 'Inactive';
  joinDate: string; // YYYY-MM-DD
  avatar?: string;
}
```
**Current:** `usersData` array with 5 users
**Usage:** Dashboard Users page

#### 2. Vehicles (`/lib/data/vehicles.ts`)
**Type:** `Vehicle`
```typescript
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  status: 'Available' | 'Sold' | 'Pending';
  price: number;
  mileage: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  imageUrl?: string;
}
```
**Current:** `vehiclesData` array with 6 vehicles
**Usage:** Dashboard Vehicles page, inventory tracking

#### 3. Inventory (`/lib/data/inventory.ts`)
**Type:** `Inventory`
```typescript
interface Inventory {
  id: string;
  vehicleId: string;
  vehicleName: string;
  quantity: number;
  location: string;
  lastUpdated: string; // YYYY-MM-DD
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
```
**Current:** `inventoryData` array with 5 items
**Usage:** Dashboard Inventory page, stock level tracking

#### 4. Images (`/lib/data/images.ts`)
**Type:** `Image`
```typescript
interface Image {
  id: string;
  vehicleId: string;
  vehicleName: string;
  url: string;
  type: 'Interior' | 'Exterior' | 'Documentation';
  uploadedAt: string; // YYYY-MM-DD
  uploadedBy: string;
}
```
**Current:** `imagesData` array with 6 images
**Usage:** Dashboard Images page

#### 5. Favorites (`/lib/data/favorites.ts`)
**Type:** `Favorite`
```typescript
interface Favorite {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  addedAt: string; // YYYY-MM-DD
}
```
**Current:** `favoritesData` array with 5 favorites
**Usage:** Dashboard Favorites page

#### 6. Enquiries (`/lib/data/enquiries.ts`)
**Type:** `Enquiry`
```typescript
interface Enquiry {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string; // YYYY-MM-DD
  priority: 'Low' | 'Medium' | 'High';
}
```
**Current:** `enquiriesData` array with 5 enquiries
**Usage:** Dashboard Enquiries page, customer communication

#### 7. Enquiry Replies (`/lib/data/replies.ts`)
**Type:** `EnquiryReply`
```typescript
interface EnquiryReply {
  id: string;
  enquiryId: string;
  repliedBy: string;
  message: string;
  timestamp: string; // ISO 8601
}
```
**Current:** `enquiryRepliesData` array with 5 replies
**Usage:** Dashboard Replies page, communication history

#### 8. Notifications (`/lib/data/notifications.ts`)
**Type:** `Notification`
```typescript
interface Notification {
  id: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO 8601
  actionUrl?: string;
}
```
**Current:** `notificationsData` array with 5 notifications
**Usage:** Dashboard Notifications page, alerts

## How to Replace with API

### Step 1: Create API Hooks (SWR Recommended)

Create a new file `/lib/hooks/useUsers.ts`:

```typescript
import useSWR from 'swr';
import { User } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useUsers() {
  const { data, error, isLoading } = useSWR<User[]>(
    '/api/users',
    fetcher
  );

  return {
    users: data || [],
    isLoading,
    error,
  };
}
```

Create similar hooks for all data types:
- `useVehicles()`
- `useInventory()`
- `useImages()`
- `useFavorites()`
- `useEnquiries()`
- `useReplies()`
- `useNotifications()`

### Step 2: Update Components

Replace dummy data imports with API hooks.

**Before:**
```typescript
import { usersData } from '@/lib/data/users';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(usersData);
  // ...
}
```

**After:**
```typescript
import { useUsers } from '@/lib/hooks/useUsers';

export default function UsersPage() {
  const { users, isLoading } = useUsers();
  
  if (isLoading) return <SkeletonLoader />;
  
  return <DataTable data={users} />;
}
```

### Step 3: Create API Routes

Create backend endpoints in `/app/api/`:

```typescript
// /app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { usersData } from '@/lib/data/users'; // Can be replaced with DB query

export async function GET(request: NextRequest) {
  try {
    // Replace usersData with your actual database query
    return NextResponse.json(usersData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
```

## Features Ready for Backend Integration

### Components That Accept Dummy Data
- `DataTable` - Searchable, paginated table component
- `StatCard` - Metric cards with trends
- `Badge` - Status indicators
- `EmptyState` - Fallback UI
- `SkeletonLoader` - Loading states

### Data Persistence Points
1. **Dashboard** - Fetches all types for overview
2. **Users Page** - CRUD operations on users
3. **Vehicles Page** - CRUD operations on vehicles
4. **Inventory Page** - Stock level updates
5. **Enquiries Page** - Customer communication
6. **Notifications Page** - Mark as read functionality
7. **Settings Page** - User preferences

## Date Format Standards

- **Short dates:** `YYYY-MM-DD` (e.g., "2024-06-08")
- **Full datetime:** ISO 8601 format (e.g., "2024-06-08T09:30:00")

## Environment Variables

Add these to your `.env.local` for API configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# Or use:
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

## Migration Checklist

- [ ] Create SWR hooks for all data types
- [ ] Create API routes in `/app/api/`
- [ ] Update all page components to use hooks
- [ ] Test data fetching and error states
- [ ] Add loading skeletons to all pages
- [ ] Implement error boundaries
- [ ] Add real database integration
- [ ] Test pagination and search
- [ ] Implement create/update/delete operations
- [ ] Add request validation
- [ ] Add proper error handling
- [ ] Deploy to production

## Performance Tips

1. Use SWR for client-side caching
2. Implement pagination (default: 10 rows per page)
3. Add search/filter on the backend when possible
4. Use database indexes for frequently queried fields
5. Cache API responses appropriately
6. Implement loading skeletons for better UX
7. Use React Suspense for code splitting

## Support

For questions about the component API:
- Check component files in `/components/`
- Review usage in page files in `/app/dashboard/`
- All components use TypeScript for type safety
