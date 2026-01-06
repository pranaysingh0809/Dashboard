// User roles - matches API schema
export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';
export type UserSubRole = 'MANAGER' | 'PICKUP' | 'STORE_MANAGER' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  subRole?: UserSubRole;
  vendorId?: string;
  storeId?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  lastActive?: string;
}

// For creating a new user (includes password)
export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  subRole?: UserSubRole;
  vendorId?: string;
  storeId?: string;
}

// Vendor & Store
export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  gradingSystem?: number;
  createdAt?: string;
  updatedAt?: string;
  // Keep these for UI compatibility (may not come from API)
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'pending';
  storeCount?: number;
  totalOrders?: number;
}

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  // Optional fields for UI
  status?: 'active' | 'inactive' | 'pending';
  vendor?: Vendor;
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

// ============================================
// Orders Grouped By Store API Types
// ============================================

// Order item from the grouped-by-store API
export interface StoreOrder {
  id: string;
  oId: string;
  status: string;
  deviceBrand: string;
  deviceModel: string;
  devicePrice: string;
  createdAt: string;
}

// Vendor info nested in store
export interface StoreVendorInfo {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  paymentType: string;
}

// Store info from the API
export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  vendor: StoreVendorInfo;
}

// Store group containing orders
export interface StoreOrderGroup {
  storeId: string;
  store: StoreInfo;
  orders: StoreOrder[];
  totalOrders: number;
}

// API response structure
export interface OrdersGroupedByStoreResponse {
  success: boolean;
  message: string;
  data: {
    stores: StoreOrderGroup[];
    totalStores: number;
    totalOrders: number;
  };
}

// Flattened order for table display
export interface FlattenedOrder {
  id: string;
  oId: string;
  status: string;
  deviceBrand: string;
  deviceModel: string;
  devicePrice: string;
  createdAt: string;
  storeName: string;
  storeCity: string;
  storeAddress: string;
  vendorName: string;
  vendorId: string;
  storeId: string;
}

// ============================================
// Order Details API Types
// ============================================

// Detailed order information for single order view
export interface OrderDetails {
  id: string;
  oId: string;
  status: string;
  deviceBrand: string;
  deviceModel: string;
  devicePrice: string;
  createdAt: string;
  updatedAt?: string;
  
  // Store information
  store: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  
  // Vendor information
  vendor: {
    id: string;
    name: string;
    contactEmail: string;
    contactPhone: string;
    paymentType: string;
  };
  
  // Additional fields that may come from API
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deviceImei?: string;
  deviceStorage?: string;
  deviceCondition?: string;
  expectedPrice?: string;
  finalPrice?: string;
  pickupDate?: string;
  pickupTime?: string;
  pickupAddress?: string;
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
  timeline?: OrderTimelineItem[];
}

// Timeline item for order history
export interface OrderTimelineItem {
  id: string;
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}