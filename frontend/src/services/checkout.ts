import { useMutation } from '@tanstack/react-query';
import api from './api';
import type { ApiResponse, Address } from '@/types';

export interface CreateRazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentResponse {
  orderId: number;
  orderNumber: string;
  paymentStatus: string;
  isSuccess: boolean;
  message: string;
}

export const checkoutApi = {
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<ApiResponse<Address[]>>('/addresses');
    return response.data.data;
  },

  async createAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const response = await api.post<ApiResponse<Address>>('/addresses', address);
    return response.data.data;
  },

  async updateAddress(id: number, address: Partial<Address>): Promise<Address> {
    const response = await api.put<ApiResponse<Address>>(`/addresses/${id}`, address);
    return response.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async createRazorpayOrder(orderId: number, amount: number): Promise<CreateRazorpayOrderResponse> {
    const response = await api.post<ApiResponse<string>>(
      `/payments/razorpay/create-order?orderId=${orderId}&amount=${amount}`
    );
    return {
      razorpayOrderId: response.data.data,
      amount,
      currency: 'INR',
    };
  },

  async verifyPayment(paymentData: {
    orderId: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }): Promise<VerifyPaymentResponse> {
    const response = await api.post<ApiResponse<VerifyPaymentResponse>>(
      '/payments/razorpay/verify',
      paymentData
    );
    return response.data.data;
  },

  async getDeliveryStatus(orderId: number): Promise<{
    status: string;
    trackingNumber: string;
    deliveryPartner: string;
    estimatedDelivery: string;
    deliveryPartnerLat: number;
    deliveryPartnerLng: number;
  }> {
    const response = await api.get(`/delivery/${orderId}`);
    return response.data.data;
  },
};

// React Query Hooks
export function useCreateAddress() {
  return useMutation({
    mutationFn: (address: Omit<Address, 'id'>) => checkoutApi.createAddress(address),
  });
}

export function useUpdateAddress() {
  return useMutation({
    mutationFn: ({ id, address }: { id: number; address: Partial<Address> }) =>
      checkoutApi.updateAddress(id, address),
  });
}

export function useDeleteAddress() {
  return useMutation({
    mutationFn: (id: number) => checkoutApi.deleteAddress(id),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: {
      orderId: number;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }) => checkoutApi.verifyPayment(data),
  });
}
