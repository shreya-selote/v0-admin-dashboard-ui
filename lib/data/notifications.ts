import { Notification } from '@/lib/types';

export const notificationsData: Notification[] = [
  {
    id: '1',
    type: 'Success',
    title: 'Vehicle Listed',
    message: 'Tesla Model 3 has been successfully added to inventory.',
    read: false,
    createdAt: '2024-06-08T09:30:00',
    actionUrl: '/vehicles/1',
  },
  {
    id: '2',
    type: 'Info',
    title: 'New Enquiry',
    message: 'You have a new enquiry for Mercedes-Benz C-Class from Jessica Chen.',
    read: false,
    createdAt: '2024-06-08T08:15:00',
    actionUrl: '/enquiries/2',
  },
  {
    id: '3',
    type: 'Warning',
    title: 'Low Inventory',
    message: 'Honda Civic inventory is running low (2 units remaining).',
    read: false,
    createdAt: '2024-06-07T14:45:00',
    actionUrl: '/inventory',
  },
  {
    id: '4',
    type: 'Info',
    title: 'User Added',
    message: 'New team member Emily Wilson has joined the system.',
    read: true,
    createdAt: '2024-06-06T10:00:00',
    actionUrl: '/users',
  },
  {
    id: '5',
    type: 'Success',
    title: 'Payment Received',
    message: 'Payment for BMW 3 Series has been processed successfully.',
    read: true,
    createdAt: '2024-06-05T16:30:00',
  },
];
