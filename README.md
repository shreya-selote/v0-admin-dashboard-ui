# AutoHub Dashboard

A premium SaaS dashboard for vehicle inventory management, built with Next.js 16, React, Tailwind CSS, and modern design principles inspired by Linear, Stripe, and Vercel.

## Features

### Dashboard Pages
- **Dashboard (Overview)** - Key metrics, trend charts, sales data, team members
- **Users** - Team member management with role-based access
- **Vehicles** - Vehicle inventory with price, mileage, and status tracking
- **Inventory** - Stock level monitoring by location
- **Images** - Vehicle photo and documentation management
- **Favorites** - User-favorited vehicles tracking
- **Enquiries** - Customer enquiry management with priority levels
- **Enquiry Replies** - Communication history for customer interactions
- **Notifications** - System notifications with read/unread status
- **Settings** - Account, security, privacy, and API settings

### UI Components

#### Premium Components
- **StatCard** - Metric cards with trend indicators
- **DataTable** - Searchable, paginated table with customizable columns
- **Badge** - Multi-variant status indicators (success, error, warning, info)
- **SkeletonLoader** - Loading states for cards, tables, and lists
- **EmptyState** - Beautiful empty state fallbacks
- **Sidebar** - Responsive navigation with mobile menu
- **DashboardHeader** - Page headers with breadcrumbs and actions

#### Features
- Professional dark mode theme with OKLCH color system
- Smooth hover animations and transitions
- Responsive design (mobile-first approach)
- Accessible components with semantic HTML
- Charts and data visualizations with Recharts
- Loading states and skeleton screens
- Empty state handling

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with dark mode
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Data Fetching:** SWR-ready (uses dummy data)
- **TypeScript:** Full type safety

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with dark mode
│   ├── page.tsx                # Redirect to dashboard
│   ├── globals.css             # Design tokens and animations
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout with sidebar
│       ├── page.tsx            # Dashboard overview
│       ├── users/
│       ├── vehicles/
│       ├── inventory/
│       ├── images/
│       ├── favorites/
│       ├── enquiries/
│       ├── replies/
│       ├── notifications/
│       └── settings/
├── components/
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── dashboard-header.tsx    # Page header with breadcrumbs
│   ├── stat-card.tsx           # Metric cards
│   ├── data-table.tsx          # Searchable, paginated table
│   ├── badge.tsx               # Status badges
│   ├── skeleton-loader.tsx     # Loading placeholders
│   └── empty-state.tsx         # Empty state fallback
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   └── data/
│       ├── users.ts            # User dummy data
│       ├── vehicles.ts         # Vehicle dummy data
│       ├── inventory.ts        # Inventory dummy data
│       ├── images.ts           # Image dummy data
│       ├── favorites.ts        # Favorite dummy data
│       ├── enquiries.ts        # Enquiry dummy data
│       ├── replies.ts          # Reply dummy data
│       └── notifications.ts    # Notification dummy data
└── public/
    └── images/                 # Image assets
```

## Dummy Data

All dummy data is kept in separate files (`/lib/data/`) for easy replacement with API calls.

### Data Types

- **User** - Team members with roles (Admin, Manager, User)
- **Vehicle** - Car inventory with pricing and specs
- **Inventory** - Stock levels by location
- **Image** - Vehicle photos and documentation
- **Favorite** - User favorites tracking
- **Enquiry** - Customer enquiries with priority
- **EnquiryReply** - Communication responses
- **Notification** - System alerts and messages

### Current Sample Data
- 5 Users
- 6 Vehicles
- 5 Inventory items
- 6 Images
- 5 Favorites
- 5 Enquiries
- 5 Replies
- 5 Notifications

## Design System

### Color Palette
- **Primary:** `oklch(0.55 0.2 264.36)` - Blue
- **Success:** Green (`oklch(0.6 0.2 264.36)`)
- **Warning:** Orange (`oklch(0.5 0.18 27)`)
- **Error:** Red (`oklch(0.65 0.18 27)`)
- **Background:** Dark (`oklch(0.11 0 0)`)
- **Foreground:** Light (`oklch(0.95 0 0)`)

### Spacing & Typography
- **Font:** Geist Sans (primary), Geist Mono (code)
- **Spacing:** Tailwind scale (4px base unit)
- **Radius:** 8px (0.5rem) default
- **Line Height:** 1.4-1.6 for body text

### Animations
- Card hover: 300ms smooth scale and shadow
- Transitions: 200ms for color changes
- Skeleton: CSS pulse animation
- Smooth fade: 300ms opacity transitions

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd autohub-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## API Integration Guide

See `API_REPLACEMENT_GUIDE.md` for detailed instructions on replacing dummy data with real API calls.

### Quick Start

1. Create API hooks in `/lib/hooks/`
2. Create API routes in `/app/api/`
3. Replace dummy imports with hooks in components
4. Add environment variables for API base URL
5. Test data fetching and error states

### Example API Hook

```typescript
import useSWR from 'swr';
import { User } from '@/lib/types';

export function useUsers() {
  const { data, error, isLoading } = useSWR<User[]>(
    '/api/users',
    fetch
  );
  return { users: data || [], isLoading, error };
}
```

## Component Usage

### StatCard
```tsx
<StatCard
  title="Active Users"
  value={4}
  subtitle="80% of total users"
  trend={{ value: 12, direction: 'up' }}
  icon={<Users className="h-6 w-6" />}
/>
```

### DataTable
```tsx
<DataTable<User>
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ]}
  data={users}
  searchPlaceholder="Search users..."
  rowsPerPage={10}
/>
```

### Badge
```tsx
<Badge variant="success" size="md">Active</Badge>
<Badge variant="error" size="sm">High Priority</Badge>
```

### EmptyState
```tsx
<EmptyState
  icon={<Heart className="h-8 w-8" />}
  title="No Favorites"
  description="Start adding your favorite vehicles."
  action={{
    label: "Browse Vehicles",
    onClick: () => router.push('/vehicles')
  }}
/>
```

## Performance

- **Lazy Loading:** Dynamic imports for routes
- **Image Optimization:** Next.js Image component ready
- **Code Splitting:** Per-page bundles
- **CSS:** Optimized Tailwind output
- **Hydration:** Fast client-side hydration

## Responsive Design

- **Mobile:** Full-screen sidebar with toggle
- **Tablet:** Optimized layout and spacing
- **Desktop:** Full sidebar with multi-column layouts
- **Charts:** Responsive container sizing

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast colors (WCAG AA)
- Focus indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript

# Database (when integrated)
pnpm db:push          # Push schema
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
```

## Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Database (when integrated)
DATABASE_URL=postgresql://...

# Other services
NEXT_PUBLIC_APP_NAME=AutoHub
```

## Project Statistics

- **Pages:** 10 dashboard pages
- **Components:** 7 reusable premium components
- **Data Types:** 8 TypeScript interfaces
- **Dummy Records:** 40+ total sample data items
- **Styling:** ~500 lines of design tokens and animations
- **Lines of Code:** ~3000+ lines (excluding comments)

## Next Steps

1. **Replace Dummy Data** - Integrate real API endpoints
2. **Add Authentication** - Implement user login/logout
3. **Database Integration** - Connect to real database
4. **CRUD Operations** - Add create/update/delete functionality
5. **Form Validation** - Add input validation and error handling
6. **Testing** - Add unit and integration tests
7. **Error Handling** - Implement error boundaries and fallbacks
8. **Analytics** - Add tracking and monitoring
9. **Deployment** - Deploy to production on Vercel

## License

MIT

## Support

For questions or issues, refer to the component source files and the `API_REPLACEMENT_GUIDE.md`.

---

Built with ❤️ for premium SaaS dashboards
