import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { ApiResponse, PaginatedResponse, DashboardStats, Order, Product, User, Address } from '@/types';

// ==================== MOCK DASHBOARD DATA ====================

const mockDashboardStats: DashboardStats = {
  totalRevenue: 12456789,
  totalOrders: 12456,
  totalUsers: 34256,
  totalProducts: 5678,
  totalCategories: 24,
  revenueToday: 285000,
  ordersToday: 142,
  newUsersToday: 38,
  pendingOrders: 980,
  lowStockProducts: 8,
  revenueGrowth: 12.5,
  orderGrowth: 8.2,
  userGrowth: 15.3,
  recentOrders: [],
  topProducts: [],
  revenueByMonth: [
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 520000 },
    { month: 'Mar', revenue: 480000 },
    { month: 'Apr', revenue: 610000 },
    { month: 'May', revenue: 750000 },
    { month: 'Jun', revenue: 820000 },
    { month: 'Jul', revenue: 780000 },
    { month: 'Aug', revenue: 850000 },
    { month: 'Sep', revenue: 920000 },
    { month: 'Oct', revenue: 890000 },
    { month: 'Nov', revenue: 1050000 },
    { month: 'Dec', revenue: 1250000 },
  ],
  ordersByStatus: [
    { status: 'Delivered', count: 8560 },
    { status: 'Processing', count: 2450 },
    { status: 'Shipped', count: 1890 },
    { status: 'Pending', count: 980 },
    { status: 'Cancelled', count: 456 },
  ],
};

// ==================== API FUNCTIONS ====================

export const adminApi = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },

  async getRecentOrders(limit = 10): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(`/admin/dashboard/recent-orders?limit=${limit}`);
    return response.data.data;
  },

  // Products
  async getProducts(page = 1, size = 20, search?: string, categoryId?: number): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.set('page', String(page - 1));
    params.set('size', String(size));
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', String(categoryId));

    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(`/admin/products?${params}`);
    return {
      ...response.data.data,
      currentPage: (response.data.data.page ?? 0) + 1,
    };
  },

  async createProduct(productData: FormData | Record<string, unknown>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data.data;
  },

  async updateProduct(id: number, productData: FormData | Record<string, unknown>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Orders
  async getOrders(page = 1, size = 20, status?: string): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    params.set('page', String(page - 1));
    params.set('size', String(size));
    if (status) params.set('status', status);

    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>(`/admin/orders?${params}`);
    return {
      ...response.data.data,
      currentPage: (response.data.data.page ?? 0) + 1,
    };
  },

  async updateOrderStatus(id: number, status: string, notes?: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status?status=${status}&notes=${notes || ''}`);
    return response.data.data;
  },

  // Customers
  async getCustomers(page = 1, size = 20, search?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    params.set('page', String(page - 1));
    params.set('size', String(size));
    if (search) params.set('search', search);

    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/admin/customers?${params}`);
    return {
      ...response.data.data,
      currentPage: (response.data.data.page ?? 0) + 1,
    };
  },

  async getCustomerDetail(id: number): Promise<User & { addresses: Address[]; recentOrders: Order[] }> {
    const response = await api.get<ApiResponse<User & { addresses: Address[]; recentOrders: Order[] }>>(`/admin/customers/${id}`);
    return response.data.data;
  },

  async toggleCustomerStatus(id: number, active: boolean): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/admin/customers/${id}/status?active=${active}`);
    return response.data.data;
  },
};

// ==================== REACT QUERY HOOKS ====================

// Dashboard
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      try {
        return await adminApi.getDashboardStats();
      } catch {
        return mockDashboardStats;
      }
    },
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Products
export function useAdminProducts(page = 1, search?: string, categoryId?: number) {
  return useQuery({
    queryKey: ['admin', 'products', page, search, categoryId],
    queryFn: async () => {
      try {
        return await adminApi.getProducts(page, 20, search, categoryId);
      } catch {
        return {
          content: [] as Product[],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          size: 20,
          first: true,
          last: true,
          empty: true,
        } as PaginatedResponse<Product>;
      }
    },
    retry: 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData | Record<string, unknown>) => adminApi.createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData | Record<string, unknown> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

// Orders
export function useAdminOrders(page = 1, status?: string) {
  return useQuery({
    queryKey: ['admin', 'orders', page, status],
    queryFn: async () => {
      try {
        return await adminApi.getOrders(page, 20, status);
      } catch {
        return {
          content: [] as Order[],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          size: 20,
          first: true,
          last: true,
          empty: true,
        } as PaginatedResponse<Order>;
      }
    },
    retry: 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      adminApi.updateOrderStatus(id, status, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });
}

// Customers
export function useAdminCustomers(page = 1, search?: string) {
  return useQuery({
    queryKey: ['admin', 'customers', page, search],
    queryFn: async () => {
      try {
        return await adminApi.getCustomers(page, 20, search);
      } catch {
        return {
          content: [] as User[],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          size: 20,
          first: true,
          last: true,
          empty: true,
        } as PaginatedResponse<User>;
      }
    },
    retry: 0,
    staleTime: 2 * 60 * 1000,
  });
}
