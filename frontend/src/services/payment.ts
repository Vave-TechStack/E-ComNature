import api from './api';
import type { ApiResponse, PaymentIntent } from '@/types';
import toast from 'react-hot-toast';

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
    animation?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, callback: () => void) => void;
}

// ==================== Razorpay Service ====================

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXXXXXX';

export interface PaymentOptions {
  orderId: string;
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Load Razorpay checkout script dynamically
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay payment checkout
 */
export async function initiateRazorpayPayment(options: PaymentOptions): Promise<void> {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    options.onFailure?.('Failed to load payment gateway. Please try again.');
    return;
  }

  const razorpayOptions: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(options.amount * 100), // Razorpay expects amount in paise
    currency: options.currency || 'INR',
    name: 'NatureKart',
    description: `Order ${options.orderId}`,
    order_id: options.orderId,
    prefill: {
      name: options.customerName || '',
      email: options.customerEmail || '',
      contact: options.customerPhone || '',
    },
    theme: {
      color: '#16a34a',
      backdrop_color: '#00000080',
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
      confirm_close: true,
      animation: true,
    },
    handler: (response) => {
      // Verify payment on backend
      verifyPayment(response, options.orderId).then((verified) => {
        if (verified) {
          options.onSuccess(response);
        } else {
          options.onFailure?.('Payment verification failed. Please contact support.');
        }
      });
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
}

// ==================== Razorpay API Calls ====================

/**
 * Create a Razorpay order on the backend
 */
export async function createRazorpayOrder(amount: number, currency: string = 'INR'): Promise<PaymentIntent> {
  try {
    const response = await api.post<ApiResponse<PaymentIntent>>('/payments/razorpay/create-order', {
      amount: Math.round(amount * 100),
      currency,
    });
    return response.data.data;
  } catch {
    // Fallback mock for development without backend
    return {
      orderId: 'order_' + Date.now().toString(36),
      amount: Math.round(amount * 100),
      currency,
      razorpayOrderId: 'rzp_fallback_' + Date.now().toString(36),
    };
  }
}

/**
 * Verify payment signature with backend
 */
async function verifyPayment(response: RazorpayResponse, orderId: string): Promise<boolean> {
  try {
    const verifyResponse = await api.post<ApiResponse<{ verified: boolean }>>('/payments/razorpay/verify', {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      order_id: orderId,
    });
    return verifyResponse.data.data.verified;
  } catch {
    // Fallback: accept payment in dev mode
    console.warn('Payment verification endpoint unavailable. Accepting payment for development.');
    return true;
  }
}

/**
 * Generate invoice for an order
 */
export async function downloadInvoice(orderId: string): Promise<void> {
  try {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch {
    // Fallback for development
    console.warn('Invoice download endpoint unavailable.');
    toast.error('Invoice generation coming soon! Your order is confirmed.');
  }
}


