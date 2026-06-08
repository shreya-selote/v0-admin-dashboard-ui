export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

export interface Vehicle {
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

export interface Inventory {
  id: string;
  vehicleId: string;
  vehicleName: string;
  quantity: number;
  location: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Image {
  id: string;
  vehicleId: string;
  vehicleName: string;
  url: string;
  type: 'Interior' | 'Exterior' | 'Documentation';
  uploadedAt: string;
  uploadedBy: string;
}

export interface Favorite {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  addedAt: string;
}

export interface Enquiry {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface EnquiryReply {
  id: string;
  enquiryId: string;
  repliedBy: string;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
