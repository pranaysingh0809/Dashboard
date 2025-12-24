// User roles
export type UserRole = 'super_admin' | 'admin' | 'pickup_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActive?: string;
}

// Vendor & Store
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  storeCount: number;
  totalOrders: number;
  createdAt: string;
}

export interface Store {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Product Catalog
export interface Product {
  id: string;
  brand: string;
  model: string;
  storage: string;
  conditionGrades: ProductCondition[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProductCondition {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  description: string;
  price: number;
}

// Order statuses
export type OrderStatus = 
  | 'created'
  | 'pending_approval'
  | 'approved'
  | 'assigned'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'verified'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  deviceStorage: string;
  deviceImei: string;
  expectedCondition: string;
  actualCondition?: string;
  expectedPrice: number;
  finalPrice?: number;
  status: OrderStatus;
  assignedTo?: string;
  assignedToName?: string;
  pickupDate?: string;
  pickupTime?: string;
  notes?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

// Pickup
export type PickupStatus = 
  | 'scheduled'
  | 'in_transit'
  | 'arrived'
  | 'collected'
  | 'delivered'
  | 'failed'
  | 'rescheduled';

export interface Pickup {
  id: string;
  orderId: string;
  orderNumber: string;
  pickupManagerId: string;
  pickupManagerName: string;
  storeName: string;
  storeAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  status: PickupStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Edge Cases
export type EdgeCaseType = 
  | 'condition_dispute'
  | 'pricing_adjustment'
  | 'pickup_failure'
  | 'customer_complaint'
  | 'other';

export type EdgeCaseStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

export interface EdgeCase {
  id: string;
  orderId: string;
  orderNumber: string;
  type: EdgeCaseType;
  title: string;
  description: string;
  expectedValue: string;
  actualValue: string;
  requestedBy: string;
  requestedByName: string;
  status: EdgeCaseStatus;
  resolvedBy?: string;
  resolvedByName?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  pendingOrders: number;
  unassignedPickups: number;
  inProgressOrders: number;
  completedToday: number;
  completedThisWeek: number;
  pendingEdgeCases: number;
  totalRevenue: number;
  avgProcessingTime: number;
}

// Chart data
export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

// Activity feed
export interface ActivityItem {
  id: string;
  type: 'order' | 'pickup' | 'edge_case' | 'user';
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
