import { useQuery, useMutation } from '@tanstack/react-query';
import api from './api';
import type { ApiResponse, PaginatedResponse, Order, Address, Coupon } from '@/types';

// ==================== MOCK ORDER DATA ====================
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ECO-20260101-001',
    status: 'DELIVERED',
    subtotal: 1298,
    shippingCharge: 0,
    taxAmount: 64.9,
    discountAmount: 0,
    couponDiscount: 0,
    totalAmount: 1362.9,
    paidAmount: 1362.9,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'SUCCESSFUL',
    shippingAddress: {
      label: 'Home',
      fullName: 'Rajesh Kumar',
      phone: '9876543210',
      addressLine1: '123, Green Valley Apartments',
      addressLine2: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      isDefault: true,
      addressType: 'home',
    },
    items: [
      { id: 1, productId: 1, productName: 'Wild Forest Honey (500g)', productImage: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&q=80', quantity: 1, unitPrice: 649, sellingPrice: 649, totalPrice: 649, isCancelled: false, isReturned: false },
      { id: 2, productId: 2, productName: 'Organic Foxtail Millet (1kg)', productImage: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=200', quantity: 1, unitPrice: 249, sellingPrice: 249, totalPrice: 249, isCancelled: false, isReturned: false },
    ],
    statusHistory: [
      { id: 1, fromStatus: 'PENDING', toStatus: 'CONFIRMED', changedBy: 'System', notes: 'Payment verified', createdAt: '2026-01-01T10:00:00.000Z' },
      { id: 2, fromStatus: 'CONFIRMED', toStatus: 'SHIPPED', changedBy: 'Warehouse', notes: 'Shipped via Delhivery', createdAt: '2026-01-02T14:00:00.000Z' },
      { id: 3, fromStatus: 'SHIPPED', toStatus: 'DELIVERED', changedBy: 'Delivery Partner', notes: 'Delivered successfully', createdAt: '2026-01-04T16:00:00.000Z' },
    ],
    createdAt: '2026-01-01T09:30:00.000Z',
    trackingNumber: 'DLV-ECO-20260101-001',
    deliveryPartner: 'Delhivery',
    deliveryEstimate: '2026-01-04T00:00:00.000Z',
    deliveredAt: '2026-01-04T16:00:00.000Z',
  },
  {
    id: 2,
    orderNumber: 'ECO-20260102-002',
    status: 'SHIPPED',
    subtotal: 899,
    shippingCharge: 49,
    taxAmount: 44.95,
    discountAmount: 0,
    couponDiscount: 0,
    totalAmount: 992.95,
    paidAmount: 992.95,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    shippingAddress: {
      label: 'Office',
      fullName: 'Rajesh Kumar',
      phone: '9876543210',
      addressLine1: '456, Tech Park',
      addressLine2: 'Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100',
      country: 'India',
      isDefault: false,
      addressType: 'work',
    },
    items: [
      { id: 3, productId: 5, productName: 'A2 Gir Cow Ghee (500ml)', productImage: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=200&q=80', quantity: 1, unitPrice: 899, sellingPrice: 899, totalPrice: 899, isCancelled: false, isReturned: false },
    ],
    statusHistory: [
      { id: 3, fromStatus: 'PENDING', toStatus: 'CONFIRMED', changedBy: 'System', notes: 'Order confirmed', createdAt: '2026-01-02T11:00:00.000Z' },
      { id: 4, fromStatus: 'CONFIRMED', toStatus: 'SHIPPED', changedBy: 'Warehouse', notes: 'Shipped via Blue Dart', createdAt: '2026-01-03T15:00:00.000Z' },
    ],
    createdAt: '2026-01-02T10:30:00.000Z',
    trackingNumber: 'BD-ECO-20260102-002',
    deliveryPartner: 'Blue Dart',
    deliveryEstimate: '2026-01-06T00:00:00.000Z',
  },
  {
    id: 3,
    orderNumber: 'ECO-20260105-003',
    status: 'PENDING',
    subtotal: 548,
    shippingCharge: 0,
    taxAmount: 27.4,
    discountAmount: 0,
    couponDiscount: 0,
    totalAmount: 575.4,
    paidAmount: 575.4,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'SUCCESSFUL',
    shippingAddress: {
      label: 'Home',
      fullName: 'Rajesh Kumar',
      phone: '9876543210',
      addressLine1: '123, Green Valley Apartments',
      addressLine2: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      isDefault: true,
      addressType: 'home',
    },
    items: [
      { id: 4, productId: 3, productName: 'Cold Pressed Coconut Oil (1L)', productImage: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=200', quantity: 1, unitPrice: 499, sellingPrice: 499, totalPrice: 499, isCancelled: false, isReturned: false },
      { id: 5, productId: 12, productName: 'Herbal Ashwagandha Powder (200g)', productImage: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=200', quantity: 1, unitPrice: 49, sellingPrice: 49, totalPrice: 49, isCancelled: false, isReturned: false },
    ],
    statusHistory: [
      { id: 5, fromStatus: 'PENDING', toStatus: 'PENDING', changedBy: 'System', notes: 'Order placed successfully', createdAt: '2026-01-05T18:30:00.000Z' },
    ],
    createdAt: '2026-01-05T18:30:00.000Z',
  },
];

function getMockOrders(userId?: number): PaginatedResponse<Order> {
  const filtered = userId ? mockOrders : mockOrders;
  return {
    content: filtered,
    totalElements: filtered.length,
    totalPages: 1,
    page: 0,
    currentPage: 1,
    size: 10,
    first: true,
    last: true,
    empty: filtered.length === 0,
  };
}

// ==================== API FUNCTIONS ====================

export const orderApi = {
  async createOrder(orderData: {
    shippingAddressId: number;
    billingAddressId?: number;
    paymentMethod: string;
    couponCode?: string;
    items: { productId: number; variantId?: number; quantity: number; unitPrice: number }[];
  }): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  async getOrders(page = 1, size = 10): Promise<PaginatedResponse<Order>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>(`/orders/my-orders?page=${page - 1}&size=${size}`);
    return {
      ...response.data.data,
      currentPage: (response.data.data.page ?? 0) + 1,
    };
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/number/${orderNumber}`);
    return response.data.data;
  },

  async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status?status=CANCELLED&notes=${reason || ''}`);
    return response.data.data;
  },

  async validateCoupon(code: string, orderAmount: number): Promise<Coupon> {
    const response = await api.post<ApiResponse<Coupon>>(`/coupons/validate?code=${code}&orderAmount=${orderAmount}`);
    return response.data.data;
  },
};

// ==================== REACT QUERY HOOKS ====================

export function useOrders(page = 1) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: async () => {
      try {
        return await orderApi.getOrders(page);
      } catch {
        return getMockOrders();
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}

export function useOrder(id: number | string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      try {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        if (isNaN(numId)) {
          return await orderApi.getOrderByNumber(id as string);
        }
        return await orderApi.getOrder(numId);
      } catch {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return mockOrders.find(o => o.id === numId || o.orderNumber === id) || null;
      }
    },
    enabled: !!id,
    retry: 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (orderData: Parameters<typeof orderApi.createOrder>[0]) =>
      orderApi.createOrder(orderData),
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      orderApi.validateCoupon(code, amount),
  });
}
