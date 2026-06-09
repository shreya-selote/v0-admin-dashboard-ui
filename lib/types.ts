export interface User {
  id: string;
  // Real `users` collection stores marketplace accounts.
  firstName?: string;
  lastName?: string;
  /** Computed full name (firstName + lastName) returned by the API. */
  name: string;
  email: string;
  password?: string; // never returned to the client
  userType?: 'buyer' | 'seller' | 'admin' | string;
  /** Mapped from userType for display. */
  role: string;
  phone?: string;
  city?: string;
  state?: string;
  isVerified?: boolean;
  /** Derived: "Active" when verified, otherwise "Inactive". */
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
  // Real `images` collection shape.
  image_id?: string;
  listing_id: string;
  image_url: string;
  is_thumbnail?: boolean;
  /** Convenience alias for image_url so the UI can use either. */
  url?: string;
  createdAt?: string;
}

export interface Favorite {
  id: string;
  favorite_id?: string;
  // Real `favorites` collection uses userId/carId/createdAt.
  userId?: string;
  carId?: string;
  user_id: string;
  listing_id: string;
  created_at: string;
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
  // Real `enquiry_replies` collection shape.
  reply_id?: string;
  enquiry_id: string;
  sender_id: string;
  reply_text: string;
  timestamp: string;
  /** UI-friendly aliases. */
  enquiryId: string;
  repliedBy: string;
  message: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
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
