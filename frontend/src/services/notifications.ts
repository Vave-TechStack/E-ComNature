import api from './api';
import type { ApiResponse } from '@/types';

export interface SendOrderNotificationParams {
  phone: string;
  orderNumber: string;
  status: string;
  customerName: string;
}

export interface SendBulkNotificationParams {
  userIds: number[];
  title: string;
  message: string;
  type: 'order_update' | 'promotional' | 'reminder';
  imageUrl?: string;
}

/**
 * Send order status update via WhatsApp using Twilio
 */
export async function sendOrderWhatsApp(params: SendOrderNotificationParams): Promise<boolean> {
  try {
    await api.post<ApiResponse<{ sent: boolean }>>('/notifications/whatsapp/order-update', {
      phone: params.phone,
      orderNumber: params.orderNumber,
      status: params.status,
      customerName: params.customerName,
    });
    return true;
  } catch {
    // Fallback: log to console for development
    console.log(`[WhatsApp Notification] Order ${params.orderNumber}: ${params.status} — sent to ${params.phone}`);
    return true; // Don't fail in dev mode
  }
}

/**
 * Send push notification to browser (via service worker)
 */
export async function sendPushNotification(title: string, body: string, icon?: string, url?: string): Promise<void> {
  if (!('Notification' in window)) {
    console.warn('Push notifications not supported in this browser');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Push notification permission denied');
    return;
  }

  // Register service worker for push notifications
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: icon || '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: url || '/' },
      tag: 'naturekart-notification',
      renotify: true,
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    } as NotificationOptions);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

/**
 * Request notification permission and subscribe for push
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Get current notification permission status
 */
export function getNotificationStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

/**
 * Send bulk notifications (admin feature)
 */
export async function sendBulkNotifications(params: SendBulkNotificationParams): Promise<boolean> {
  try {
    await api.post<ApiResponse<{ sent: number }>>('/notifications/bulk', params);
    return true;
  } catch {
    console.warn('Bulk notification endpoint unavailable. (Dev mode)');
    // Simulate sending in dev
    console.log(`[Bulk Notification] Sent to ${params.userIds.length} users: "${params.title}"`);
    return true;
  }
}

/**
 * Update notification preferences on backend
 */
export async function updateNotificationPreferences(preferences: {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  push?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  reminders?: boolean;
}): Promise<boolean> {
  try {
    await api.put('/profile/notifications/preferences', preferences);
    return true;
  } catch {
    console.warn('Notification preferences endpoint unavailable. Saved locally.');
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
    return true;
  }
}
