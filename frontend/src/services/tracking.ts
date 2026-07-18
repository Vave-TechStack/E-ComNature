import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, WS_URL } from '@/lib/constants';
import api from './api';

// ==================== Types ====================

export interface TrackingUpdate {
  orderId: string;
  status: OrderStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  estimatedDelivery?: string;
  updatedAt: string;
  message?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'IN_TRANSIT'
  | 'NEARBY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderTrackingInfo {
  orderNumber: string;
  currentStatus: OrderStatus;
  estimatedDelivery: string;
  deliveryPartner?: string;
  trackingNumber?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    location?: string;
    description: string;
  }[];
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'IN_TRANSIT',
  'NEARBY',
  'DELIVERED',
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Order Confirmed',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  IN_TRANSIT: 'In Transit',
  NEARBY: 'Nearby — Arriving Soon',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export const STATUS_ICONS: Record<OrderStatus, string> = {
  PENDING: '📋',
  CONFIRMED: '✅',
  PROCESSING: '⚙️',
  PACKED: '📦',
  SHIPPED: '🚚',
  OUT_FOR_DELIVERY: '🚛',
  IN_TRANSIT: '📍',
  NEARBY: '🔔',
  DELIVERED: '🎉',
  CANCELLED: '❌',
  RETURNED: '↩️',
};

// ==================== WebSocket Service ====================

class TrackingSocket {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(update: TrackingUpdate) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(orderId: string): void {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL || 'ws://localhost:8080/ws', {
      transports: ['websocket'],
      query: { orderId },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log(`[Tracking] Connected for order ${orderId}`);
      this.reconnectAttempts = 0;
      this.socket?.emit('subscribe', { orderId });
    });

    this.socket.on('tracking_update', (data: TrackingUpdate) => {
      const orderListeners = this.listeners.get(data.orderId);
      if (orderListeners) {
        orderListeners.forEach((listener) => listener(data));
      }
    });

    this.socket.on('disconnect', () => {
      console.log('[Tracking] Disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Tracking] Connection error:', err.message);
      this.reconnectAttempts++;
    });
  }

  subscribe(orderId: string, callback: (update: TrackingUpdate) => void): () => void {
    if (!this.listeners.has(orderId)) {
      this.listeners.set(orderId, new Set());
    }
    this.listeners.get(orderId)!.add(callback);

    // Auto-connect if not connected
    if (!this.socket?.connected) {
      this.connect(orderId);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(orderId)?.delete(callback);
      if (this.listeners.get(orderId)?.size === 0) {
        this.listeners.delete(orderId);
      }
    };
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }
}

export const trackingSocket = new TrackingSocket();

// ==================== REST API Functions ====================

/**
 * Fetch order tracking information from backend
 */
export async function getOrderTracking(orderNumber: string): Promise<OrderTrackingInfo> {
  try {
    const response = await api.get(`/orders/${orderNumber}/tracking`);
    return response.data.data;
  } catch {
    // Fallback mock data for development
    return getMockTracking(orderNumber);
  }
}

/**
 * Mock tracking data for development
 */
function getMockTracking(orderNumber: string): OrderTrackingInfo {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

  const currentStatusIndex = Math.floor(Math.random() * 5) + 2; // Random status between CONFIRMED and IN_TRANSIT
  const currentStatus = ORDER_STATUS_FLOW[currentStatusIndex];

  return {
    orderNumber,
    currentStatus,
    estimatedDelivery: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'long', month: 'long', day: 'numeric',
    }),
    deliveryPartner: 'NatureKart Logistics',
    trackingNumber: 'NK-' + orderNumber.slice(-8),
    statusHistory: ORDER_STATUS_FLOW.slice(0, currentStatusIndex + 1).map((status, i) => ({
      status,
      timestamp: hoursAgo((currentStatusIndex - i) * 4),
      location: i === 0 ? 'NatureKart Fulfillment Center' : `Hub ${String.fromCharCode(65 + i)}`,
      description: getStatusDescription(status),
    })),
    currentLocation: currentStatusIndex >= 5 ? {
      lat: 12.9716 + (Math.random() - 0.5) * 0.02,
      lng: 77.5946 + (Math.random() - 0.5) * 0.02,
      address: 'Indiranagar, Bangalore, Karnataka',
    } : undefined,
  };
}

function getStatusDescription(status: OrderStatus): string {
  const descriptions: Record<OrderStatus, string> = {
    PENDING: 'Your order has been placed and is awaiting confirmation',
    CONFIRMED: 'Your order has been confirmed and we are preparing your items',
    PROCESSING: 'We are carefully packing your natural foods',
    PACKED: 'Your order has been packed and is ready for pickup',
    SHIPPED: 'Your package has been shipped from our facility',
    OUT_FOR_DELIVERY: 'Your package is out for delivery',
    IN_TRANSIT: 'Your package is in transit to the delivery hub',
    NEARBY: 'Your delivery is nearby! Arriving in 15-20 minutes',
    DELIVERED: 'Your order has been delivered successfully',
    CANCELLED: 'This order has been cancelled',
    RETURNED: 'This order has been returned',
  };
  return descriptions[status];
}

/**
 * Calculate progress percentage for tracking timeline
 */
export function getTrackingProgress(currentStatus: OrderStatus): number {
  const index = ORDER_STATUS_FLOW.indexOf(currentStatus);
  if (index === -1) return currentStatus === 'DELIVERED' ? 100 : 0;
  return Math.round((index / (ORDER_STATUS_FLOW.length - 1)) * 100);
}

/**
 * Format coordinates for map display
 */
export function formatMapUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
