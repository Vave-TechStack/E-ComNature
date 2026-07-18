'use client';

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveTracking } from '@/components/tracking/LiveTracking';

function TrackingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  return (
    <div className="min-h-screen bg-natural">
      {/* Header */}
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
                <p className="text-xs text-gray-500">Real-time tracking for {orderId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Content */}
      <div className="container-custom py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tracking" className="hover:text-primary-600 transition-colors">Track Order</Link>
            <span>/</span>
            <span className="text-primary-600 font-medium">{orderId}</span>
          </nav>

          {/* Live Tracking */}
          <LiveTracking orderNumber={orderId} />

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/orders">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                <Package className="h-4 w-4" />
                All Orders
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                <Leaf className="h-4 w-4" />
                Need Help?
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TrackingOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-natural">
        <div className="container-custom py-8">
          <Skeleton className="h-48 rounded-2xl bg-primary-100/50" />
          <Skeleton className="h-64 rounded-2xl bg-primary-100/50 mt-6" />
        </div>
      </div>
    }>
      <TrackingDetailContent />
    </Suspense>
  );
}
