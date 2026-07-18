'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Leaf, Sparkles, Download, Clock, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();

// Animated SVG checkmark
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      className="relative mx-auto flex h-28 w-28 items-center justify-center"
    >
      {/* Outer circle */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 120">
        <motion.circle
          cx="60" cy="60" r="55"
          fill="none"
          stroke="#22c55e"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
      {/* Inner circle */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-lg shadow-green-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
      </div>
      {/* Confetti particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            background: ['#22c55e', '#FFB300', '#4CAF50', '#FF6F00', '#66BB6A', '#FFA000', '#81C784', '#FF8F00'][i],
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * 45 * Math.PI) / 180) * 60,
            y: Math.sin((i * 45 * Math.PI) / 180) * 60,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
        />
      ))}
    </motion.div>
  );
}

// Estimated delivery countdown
function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    target.setHours(18, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Delivered! 🎉');
        setProgress(100);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setTimeLeft(`${days}d ${hours}h remaining`);
      const totalDuration = target.getTime() - now.getTime() + diff;
      const elapsed = totalDuration - diff;
      setProgress(Math.min(95, (elapsed / totalDuration) * 100));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-accent-50 to-yellow-50 border border-accent-100 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-accent-600" />
        <span className="text-sm font-bold text-accent-700">Estimated Delivery</span>
      </div>
      <div className="h-2 rounded-full bg-white overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500"
        />
      </div>
      <p className="text-xs text-gray-600">
        <span className="font-semibold text-accent-700">{timeLeft}</span> — Standard Delivery
      </p>
    </div>
  );
}

export default function ConfirmationPage() {
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  const handleDownloadInvoice = () => {
    setIsInvoiceLoading(true);
    setTimeout(() => {
      setIsInvoiceLoading(false);
      toast.success('Invoice downloaded successfully! 📄', { duration: 3000 });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-white">
      <div className="container-custom py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-2xl"
        >
          {/* Success Animation */}
          <div className="text-center mb-8">
            <AnimatedCheckmark />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Badge className="bg-primary-100 text-primary-700 border-0 text-xs font-semibold mb-3 px-3 py-1">
                <PartyPopper className="h-3 w-3 mr-1 inline" /> Order Confirmed
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Thank You, Nature Lover! 🌿
              </h1>
              <p className="mt-2 text-gray-500">Your natural foods order has been placed successfully</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 px-6 py-4 shadow-sm"
            >
              <Package className="h-5 w-5 text-primary-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Order Number</p>
                <p className="text-lg font-bold text-primary-700 tracking-wider font-mono">{orderNumber}</p>
              </div>
              <Separator orientation="vertical" className="h-10 bg-primary-200" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="text-lg font-bold text-primary-700">₹1,398</p>
              </div>
            </motion.div>
          </div>

          {/* Delivery Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-4"
          >
            <DeliveryCountdown />
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="rounded-3xl bg-white border border-primary-100 p-6 md:p-8 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-primary-100">
              <Leaf className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Order Confirmed</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  You will receive an email confirmation with tracking details shortly. We&apos;re carefully packing your natural foods!
                </p>
              </div>
            </div>

            <Separator className="bg-primary-100" />

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 shrink-0">
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Shipping To</p>
                <p className="text-xs text-gray-500 mt-0.5">Rajesh Kumar, 42 MG Road, Indiranagar, Bangalore - 560038</p>
                <p className="text-xs text-primary-600 font-medium mt-1">Standard Delivery (5-7 business days)</p>
              </div>
            </div>

            <Separator className="bg-primary-100" />

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 shrink-0">
                <CreditCard className="h-5 w-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Payment Method</p>
                <p className="text-xs text-gray-500 mt-0.5">Cash on Delivery</p>
                <p className="text-xs text-primary-600 font-medium mt-1">Pay when you receive your order</p>
              </div>
            </div>
          </motion.div>

          {/* Download Invoice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-4"
          >
            <Button
              variant="outline"
              className="w-full gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 h-12 font-medium"
              onClick={handleDownloadInvoice}
              disabled={isInvoiceLoading}
            >
              {isInvoiceLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Download className="h-5 w-5" />
              )}
              {isInvoiceLoading ? 'Generating Invoice...' : 'Download Invoice (PDF)'}
            </Button>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/orders" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 gradient-primary text-white font-semibold px-8 h-12 shadow-lg shadow-primary-200 text-base">
                <Package className="h-5 w-5" />
                Track Order
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 px-8 h-12 text-base font-semibold">
                <ArrowRight className="h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-center text-xs text-gray-400"
          >
            A confirmation email has been sent to your registered email address.
            <br />View order details in <Link href="/orders" className="text-primary-600 hover:underline font-medium">My Orders</Link>.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
