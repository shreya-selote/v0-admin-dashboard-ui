import { Inventory } from '@/lib/types';

export const inventoryData: Inventory[] = [
  {
    id: '1',
    vehicleId: '1',
    vehicleName: 'Tesla Model 3 - Pearl White',
    quantity: 4,
    location: 'Showroom A',
    lastUpdated: '2024-06-07',
    status: 'In Stock',
  },
  {
    id: '2',
    vehicleId: '2',
    vehicleName: 'BMW 3 Series - Black',
    quantity: 0,
    location: 'Warehouse B',
    lastUpdated: '2024-06-05',
    status: 'Out of Stock',
  },
  {
    id: '3',
    vehicleId: '3',
    vehicleName: 'Honda Civic - Silver',
    quantity: 2,
    location: 'Showroom C',
    lastUpdated: '2024-06-08',
    status: 'Low Stock',
  },
  {
    id: '4',
    vehicleId: '4',
    vehicleName: 'Toyota Corolla - Blue',
    quantity: 5,
    location: 'Warehouse A',
    lastUpdated: '2024-06-07',
    status: 'In Stock',
  },
  {
    id: '5',
    vehicleId: '5',
    vehicleName: 'Mercedes-Benz C-Class - Gray',
    quantity: 3,
    location: 'Showroom B',
    lastUpdated: '2024-06-06',
    status: 'In Stock',
  },
];
