// User & Auth Types
export type UserRole = 'admin' | 'vendor' | 'operations';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Portal Types
export type Portal = 'amazon' | 'flipkart' | 'meesho' | 'firstcry' | 'blinkit';

export interface PortalConfig {
  id: Portal;
  name: string;
  color: string;
  icon: string;
}

// Product Types
export interface Product {
  productId: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  basePrice: number;
  status: 'active' | 'inactive';
  imageUrl: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SKUMapping {
  skuId: string;
  productId: string;
  portal: Portal;
  portalSku: string;
  price: number;
  available: boolean;
}

// Inventory Types
export interface InventoryItem {
  skuId: string;
  productId: string;
  productName: string;
  portal: Portal;
  availableStock: number;
  reservedStock: number;
  warehouse: string;
  agingDays: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
  skuId: string;
  productName: string;
  quantity: number;
  price: number;
  status: OrderStatus;
}

export interface Order {
  orderId: string;
  portal: Portal;
  portalOrderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
  statusTimeline: StatusTimelineItem[];
}

export interface StatusTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// Return & Claims Types
export type ReturnReason = 'damaged' | 'wrong_item' | 'not_as_described' | 'size_issue' | 'quality_issue' | 'changed_mind';
export type ClaimStatus = 'pending' | 'eligible' | 'ineligible' | 'approved' | 'rejected' | 'completed';

export interface ReturnOrder {
  returnId: string;
  orderId: string;
  portal: Portal;
  reason: ReturnReason;
  status: ClaimStatus;
  claimEligible: boolean;
  requestDate: string;
  completedDate?: string;
  refundAmount: number;
  items: OrderItem[];
}

// Payment & Settlement Types
export type SettlementStatus = 'pending' | 'completed' | 'delayed';

export interface Settlement {
  settlementId: string;
  portal: Portal;
  amount: number;
  commission: number;
  fees: number;
  netAmount: number;
  status: SettlementStatus;
  cycleStart: string;
  cycleEnd: string;
  expectedDate: string;
  actualDate?: string;
  ordersCount: number;
}

// Vendor Types
export interface Vendor {
  vendorId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  warehouses: string[];
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  totalProducts: number;
  totalOrders: number;
}

export interface Warehouse {
  warehouseId: string;
  name: string;
  location: string;
  capacity: number;
  utilized: number;
  vendorId: string;
  storageCostPerDay: number;
}

// Alert & Notification Types
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'low_inventory' | 'payment_delay' | 'return_initiated' | 'claim_eligible' | 'order_issue';

export interface Alert {
  alertId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  portal?: Portal;
  entityId?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Analytics Types
export interface SalesData {
  date: string;
  portal: Portal;
  orders: number;
  revenue: number;
  returns: number;
}

export interface KPIData {
  totalSales: number;
  ordersToday: number;
  inventoryValue: number;
  lowStockItems: number;
  pendingReturns: number;
  pendingSettlements: number;
  salesGrowth: number;
  ordersGrowth: number;
}

// Task & Workflow Types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'escalated';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  portal?: Portal;
  relatedEntityId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
