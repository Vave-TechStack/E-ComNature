// ===================== API Response =====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;        // 0-indexed page from backend
  currentPage: number; // 1-indexed page for frontend
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ===================== User & Auth =====================
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  displayName: string;
  profileImage: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  rewardPoints: number;
  walletBalance: number;
  createdAt?: string;
}

export interface AuthResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
  deviceInfo?: string;
  deviceToken?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password: string;
  referralCode?: string;
}

export interface Address {
  id?: number;
  label: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  addressType: string;
}

// ===================== Product =====================
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  category: Category;
  brand: Brand;
  basePrice: number;
  sellingPrice: number;
  discountPercentage: number;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  averageRating: number;
  ratingCount: number;
  totalSold: number;
  availableStock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  maxQuantity?: number;
  minQuantity?: number;
  tags: ProductTag[];
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: number;
  level: number;
  productCount: number;
  isFeatured: boolean;
  subCategories?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  isFeatured: boolean;
  productCount: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  variantType: string;
  variantValue: string;
  color?: string;
  colorCode?: string;
  size?: string;
  additionalPrice: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface ProductSpecification {
  id: number;
  specKey: string;
  specValue: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductReview {
  id: number;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'profileImage'>;
  rating: number;
  title: string;
  review: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  images: string[];
  helpfulCount: number;
}

// ===================== Cart =====================
export interface CartItem {
  id?: number;
  productId: number;
  productName: string;
  productImage: string;
  variantId?: number;
  variantInfo?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isSavedForLater: boolean;
  isGiftWrap: boolean;
  notes?: string;
  product?: Product;
}

export interface Cart {
  id: number;
  totalAmount: number;
  itemCount: number;
  items: CartItem[];
}

// ===================== Order =====================
export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCharge: number;
  taxAmount: number;
  discountAmount: number;
  couponDiscount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Address;
  items: OrderItem[];
  trackingNumber?: string;
  deliveryPartner?: string;
  deliveryEstimate?: string;
  deliveredAt?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  invoiceUrl?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantInfo?: string;
  quantity: number;
  unitPrice: number;
  sellingPrice: number;
  totalPrice: number;
  isCancelled: boolean;
  isReturned: boolean;
}

export interface OrderStatusHistory {
  id: number;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  notes: string;
  createdAt: string;
}

// ===================== Payment =====================
export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  stripeSessionId?: string;
}

// ===================== Admin =====================
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  revenueToday: number;
  ordersToday: number;
  newUsersToday: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
  recentOrders: Order[];
  topProducts: Product[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}

// ===================== Support =====================
export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ===================== Notifications =====================
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

// ===================== Coupon =====================
export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

// ===================== Filter =====================
export interface ProductFilter {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  inStock?: boolean;
  onSale?: boolean;
  discountPercent?: number;
  search?: string;
  page?: number;
  size?: number;
}

// ===================== WebSocket =====================
export interface WebSocketMessage {
  type: string;
  payload: unknown;
}
