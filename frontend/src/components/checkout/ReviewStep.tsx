'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Truck, CreditCard, Shield, Leaf, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceBreakdown } from '@/components/cart/PriceBreakdown';
import { formatPrice } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

const SHIPPING_COST_MAP: Record<string, number> = {
  standard: 49,
  express: 99,
  same_day: 199,
};

interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
  selectedAddressId?: number;
  selectedShipping?: string;
  selectedPayment?: string;
  isProcessing: boolean;
}

export function ReviewStep({ onNext, onBack, selectedShipping, isProcessing }: ReviewStepProps) {
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const subtotal = totalAmount;
  const shippingCharge = selectedShipping ? SHIPPING_COST_MAP[selectedShipping] ?? 49 : 49;
  const total = subtotal + shippingCharge;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <CheckCircle className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Review Your Order</h2>
          <p className="text-sm text-noble-400">Please verify your order details before placing</p>
        </div>
      </div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
            <Package className="h-4 w-4 text-primary-600" />
          </div>
          <h3 className="text-sm font-bold text-noble-800">
            {items.length} Item{items.length > 1 ? 's' : ''} in your order
          </h3>
        </div>

        <div className="space-y-2.5">
          {items.map((item, index) => (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3.5 p-3.5 rounded-xl bg-white border border-noble-100 hover:border-noble-200 transition-colors"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-noble-50">
                <Image
                  src={item.productImage || '/images/placeholder.svg'}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-noble-800 truncate">{item.productName}</p>
                {item.variantInfo && <p className="text-xs text-noble-400 mt-0.5">{item.variantInfo}</p>}
                <p className="text-xs text-noble-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-primary-600 shrink-0">{formatPrice(item.totalPrice)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Delivery Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-noble-200 bg-white p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
              <MapPin className="h-3.5 w-3.5 text-primary-600" />
            </div>
            <span className="text-xs font-bold uppercase text-noble-500 tracking-wider">Delivering to</span>
          </div>
          <p className="text-sm font-bold text-noble-800">Rajesh Kumar</p>
          <p className="text-sm text-noble-500">42, MG Road, Indiranagar</p>
          <p className="text-sm text-noble-500">Bangalore, Karnataka - 560038</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-noble-200 bg-white p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
              <Truck className="h-3.5 w-3.5 text-primary-600" />
            </div>
            <span className="text-xs font-bold uppercase text-noble-500 tracking-wider">Shipping</span>
          </div>
          <p className="text-sm font-bold text-noble-800">
            {selectedShipping === 'express' ? 'Express Delivery' : selectedShipping === 'same_day' ? 'Same Day Delivery' : 'Standard Delivery'}
          </p>
          <p className="text-sm text-noble-500">
            {selectedShipping === 'express' ? '2-3 days' : selectedShipping === 'same_day' ? 'Today' : '5-7 days'}
          </p>
        </motion.div>
      </div>

      {/* Price Breakdown */}
      <PriceBreakdown
        subtotal={subtotal}
        shippingCharge={shippingCharge}
        totalAmount={total}
        freeShippingThreshold={499}
      />

      {/* Place Order */}
      <div className="flex items-center justify-between pt-4 border-t border-noble-100">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-noble-500 hover:text-primary-600 hover:bg-primary-50 gap-2 rounded-xl"
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isProcessing}
          className="gap-2 gradient-primary text-white px-10 h-14 text-base font-bold shadow-xl shadow-primary-200/50 hover:shadow-2xl hover:shadow-primary-300/50 transition-all disabled:opacity-50 rounded-xl"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Place Order — {formatPrice(total)}
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
