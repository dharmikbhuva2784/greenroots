// User Types
export interface User {
  $id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

// Category Types
export interface Category {
  $id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// Product Types
export interface Product {
  $id: string;
  name: string;
  scientificName?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  careTips?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export type OrderStatus = 
  | 'order_placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  scientificName?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  $id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  total: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// Payment Types
export interface PaymentDetails {
  method: 'upi' | 'card' | 'cod';
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

// Analytics Types
export interface SalesAnalytics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  periodStart: string;
  periodEnd: string;
}

export interface DailySales {
  date: string;
  orders: number;
  revenue: number;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Settings Types
export interface StoreSettings {
  taxEnabled: boolean;
  taxPercentage: number;
  currency: string;
  currencySymbol: string;
}

// Review Types
export interface Review {
  $id: string;
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// FAQ Types
export interface FAQ {
  $id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}
