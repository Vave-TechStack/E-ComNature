'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, MapPin, Clock, Phone, ChevronDown, Navigation, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import { getOrderTracking, getTrackingProgress, trackingSocket, STATUS_LABELS, STATUS_ICONS, ORDER_STATUS_FLOW, formatMapUrl } from '@/services/tracking';
import type { OrderTrackingInfo, TrackingUpdate, OrderStatus } from '@/services/tracking';
import { sendPushNotification, requestNotificationPermission } from '@/services/notifications';
import { Skeleton } from '@/components/ui/skeleton';

interface LiveTrackingProps {
  orderNumber: string;
}

export function LiveTracking({ orderNumber }: LiveTrackingProps) {
  const [tracking, setTracking] = useState<OrderTrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Fetch tracking data
  useEffect(() => {
    let mounted = true;

    async function loadTracking() {
      try {
        const data = await getOrderTracking(orderNumber);
        if (mounted) {
          setTracking(data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setError('Failed to load tracking information');
          setLoading(false);
        }
      }
    }

    loadTracking();

    // Subscribe to real-time updates via WebSocket
    const unsubscribe = trackingSocket.subscribe(orderNumber, (update: TrackingUpdate) => {
      if (!mounted) return;
      setTracking((prev) => {
        if (!prev) return prev;
        const newHistory = [
          ...prev.statusHistory,
          {
            status: update.status,
            timestamp: update.updatedAt,
            description: update.message || '',
          },
        ];
        return {
          ...prev,
          currentStatus: update.status,
          currentLocation: update.location ? {
            lat: update.location.lat,
            lng: update.location.lng,
            address: update.location.address || '',
          } : prev.currentLocation,
          statusHistory: newHistory,
        };
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [orderNumber]);

  // Enable push notifications for tracking
  const handleEnableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    if (granted) {
      await sendPushNotification(
        'Tracking Updates Enabled',
        `You'll receive live updates for order ${orderNumber}`,
        '/favicon.svg',
        `/tracking/${orderNumber}`
      );
    }
  }, [orderNumber]);

  const progress = tracking ? getTrackingProgress(tracking.currentStatus) : 0;
  const currentIndex = tracking ? ORDER_STATUS_FLOW.indexOf(tracking.currentStatus) : -1;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl bg-primary-100/50" />
        <Skeleton className="h-64 rounded-2xl bg-primary-100/50" />
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">
        <Package className="h-12 w-12 text-red-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-700">Unable to Load Tracking</h3>
        <p className="text-sm text-red-500 mt-1">{error || 'Order not found'}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4 border-red-200 text-red-600">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50 border border-primary-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn(
                'text-xs font-semibold border-0 px-3 py-1',
                tracking.currentStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                tracking.currentStatus === 'OUT_FOR_DELIVERY' || tracking.currentStatus === 'NEARBY' ? 'bg-blue-100 text-blue-700' :
                'bg-primary-100 text-primary-700'
              )}>
                {STATUS_ICONS[tracking.currentStatus]} {STATUS_LABELS[tracking.currentStatus]}
              </Badge>
              {tracking.currentStatus === 'NEARBY' && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Order #{tracking.orderNumber}</p>
          </div>
          {!notificationEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnableNotifications}
              className="gap-1.5 text-xs border-primary-200 text-primary-700"
            >
              <Bell className="h-3.5 w-3.5" />
              Enable Alerts
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2.5 rounded-full bg-primary-100 overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Order Placed</span>
          <span className="font-medium text-primary-700">{progress}% Complete</span>
          <span>Delivered</span>
        </div>

        {/* Delivery Info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white border border-primary-100 p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Clock className="h-3.5 w-3.5 text-primary-400" />
              Estimated Delivery
            </div>
            <p className="text-sm font-bold text-gray-900">{tracking.estimatedDelivery}</p>
          </div>
          {tracking.deliveryPartner && (
            <div className="rounded-xl bg-white border border-primary-100 p-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Truck className="h-3.5 w-3.5 text-primary-400" />
                Delivery Partner
              </div>
              <p className="text-sm font-bold text-gray-900">{tracking.deliveryPartner}</p>
              {tracking.trackingNumber && (
                <p className="text-[10px] text-gray-400">ID: {tracking.trackingNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Map */}
      {tracking.currentLocation && (
        <div className="rounded-2xl border border-primary-100 bg-white overflow-hidden">
          <div className="p-4 pb-0">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-red-500" />
              <p className="text-sm font-semibold text-gray-900">Live Location</p>
              <span className="flex h-2 w-2 ml-auto">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
          </div>
          {/* Map placeholder — in production use Google Maps / Mapbox embed */}
          <a
            href={formatMapUrl(tracking.currentLocation.lat, tracking.currentLocation.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 mx-4 mb-4 rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-10 w-10 text-primary-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">View on Google Maps</p>
                <p className="text-xs text-gray-400">{tracking.currentLocation.address}</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs border-primary-200 text-primary-700">
                  Open Maps
                </Button>
              </div>
            </div>
            {/* Map grid lines decoration */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          </a>
        </div>
      )}

      {/* Status Timeline */}
      <div className="rounded-2xl border border-primary-100 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-500" />
          Order Timeline
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-primary-100" />

          <div className="space-y-0">
            {ORDER_STATUS_FLOW.slice(0, 8).map((status, index) => {
              const historyItem = tracking.statusHistory.find(h => h.status === status);
              const isCompleted = currentIndex >= index;
              const isCurrent = currentIndex === index;
              const isExpanded = expandedStep === index;

              return (
                <div key={status} className="relative pl-12 pb-4 last:pb-0">
                  {/* Status dot */}
                  <div className={cn(
                    'absolute left-3 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted
                      ? 'bg-primary-600 border-primary-600'
                      : isCurrent
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                  )}>
                    {isCompleted || isCurrent ? (
                      <Package className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      'cursor-pointer rounded-xl p-3 transition-all',
                      isCurrent ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50',
                      isExpanded && 'bg-gray-50'
                    )}
                    onClick={() => setExpandedStep(isExpanded ? null : index)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={cn(
                          'text-sm font-semibold',
                          isCompleted ? 'text-primary-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                        )}>
                          {STATUS_LABELS[status]}
                        </p>
                        {historyItem && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(historyItem.timestamp, 'MMM dd, hh:mm a')}
                          </p>
                        )}
                      </div>
                      <ChevronDown className={cn(
                        'h-4 w-4 text-gray-400 transition-transform',
                        isExpanded && 'rotate-180'
                      )} />
                    </div>

                    <AnimatePresence>
                      {isExpanded && historyItem && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                            {historyItem.description}
                          </p>
                          {historyItem.location && (
                            <p className="mt-1 text-xs text-primary-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {historyItem.location}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-sm font-semibold text-primary-800">Need help with your order?</p>
            <p className="text-xs text-primary-600">Contact our support team</p>
          </div>
        </div>
        <a href="tel:+9118001238900">
          <Button size="sm" className="gradient-primary text-white text-xs font-semibold shadow-sm">
            Call Support
          </Button>
        </a>
      </div>
    </div>
  );
}
