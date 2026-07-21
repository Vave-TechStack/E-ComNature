'use client';

import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { Leaf, Truck, Shield, ChevronDown } from 'lucide-react';

interface PriceBreakdownProps {
  subtotal: number;
  shippingCharge?: number;
  discountAmount?: number;
  couponDiscount?: number;
  giftWrapCharge?: number;
  taxAmount?: number;
  totalAmount: number;
  freeShippingThreshold?: number;
}

export function PriceBreakdown({
  subtotal,
  shippingCharge = 0,
  discountAmount = 0,
  couponDiscount = 0,
  giftWrapCharge = 0,
  taxAmount = 0,
  totalAmount,
  freeShippingThreshold = 499,
}: PriceBreakdownProps) {
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const hasFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 shadow-sm"
    >
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
            <Leaf className="h-4 w-4 text-primary-600" />
          </div>
          <h3 className="text-sm font-bold text-noble-800">Price Breakdown</h3>
        </div>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-noble-500">Subtotal</span>
            <span className="font-semibold text-noble-800">{formatPrice(subtotal)}</span>
          </div>

          {/* Product Discount */}
          {discountAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between text-sm"
            >
              <span className="text-green-600 font-medium">Product Discount</span>
              <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
            </motion.div>
          )}

          {/* Coupon Discount */}
          {couponDiscount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between text-sm"
            >
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" /> Coupon Discount
              </span>
              <span className="font-semibold text-green-600">-{formatPrice(couponDiscount)}</span>
            </motion.div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-noble-400" />
              <span className="text-noble-500">Shipping</span>
            </div>
            <span className={hasFreeShipping ? 'font-semibold text-green-600' : 'font-medium text-noble-800'}>
              {hasFreeShipping ? (
                <span className="flex items-center gap-1">
                  <span className="text-green-600">FREE</span>
                  {shippingCharge > 0 && (
                    <span className="text-xs text-noble-400 line-through">{formatPrice(shippingCharge)}</span>
                  )}
                </span>
              ) : shippingCharge > 0 ? (
                formatPrice(shippingCharge)
              ) : (
                <span className="text-noble-400">Calculated at checkout</span>
              )}
            </span>
          </div>

          {/* Gift Wrap */}
          {giftWrapCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-noble-500">Gift Wrap</span>
              <span className="font-medium text-noble-800">{formatPrice(giftWrapCharge)}</span>
            </div>
          )}

          {/* Tax */}
          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-noble-500">Tax (GST)</span>
              <span className="font-medium text-noble-800">{formatPrice(taxAmount)}</span>
            </div>
          )}
        </div>

        {/* Free shipping progress */}
        {!hasFreeShipping && freeShippingThreshold > 0 && remainingForFreeShipping > 0 && (
          <div className="mt-3 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200/60 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Truck className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">Free Shipping</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
            <p className="mt-1 text-[11px] text-amber-600 font-medium">
              Add <span className="font-bold">{formatPrice(remainingForFreeShipping)}</span> more for
              <span className="font-bold"> free delivery</span>!
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="my-3 h-px bg-gradient-to-r from-noble-100 via-noble-200 to-noble-100" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-noble-800">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-primary-600">{formatPrice(Math.max(0, totalAmount))}</span>
            {totalAmount > 0 && (
              <p className="text-[10px] text-noble-400 mt-0.5">Inclusive of all taxes</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
