'use client';

import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Leaf, Truck } from 'lucide-react';

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
    <div className="rounded-2xl border border-primary-100 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Breakdown</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Product Discount</span>
              <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
            </motion.div>
          )}

          {couponDiscount > 0 && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Coupon Discount</span>
              <span className="font-semibold text-green-600">-{formatPrice(couponDiscount)}</span>
            </motion.div>
          )}

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-600">Shipping</span>
            </div>
            <span className={hasFreeShipping ? 'font-semibold text-green-600' : 'font-medium text-gray-900'}>
              {hasFreeShipping ? (
                <span className="flex items-center gap-1">
                  FREE
                  {shippingCharge > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(shippingCharge)}</span>}
                </span>
              ) : shippingCharge > 0 ? (
                formatPrice(shippingCharge)
              ) : (
                'Calculated at checkout'
              )}
            </span>
          </div>

          {!hasFreeShipping && freeShippingThreshold > 0 && remainingForFreeShipping > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-accent-50 to-orange-50 border border-accent-100 p-3 text-xs text-accent-700 font-medium flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-accent-500" />
              Add {formatPrice(remainingForFreeShipping)} more for <span className="font-bold text-accent-600">free shipping</span>!
            </div>
          )}

          {giftWrapCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gift Wrap</span>
              <span className="font-medium text-gray-900">{formatPrice(giftWrapCharge)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (GST)</span>
              <span className="font-medium text-gray-900">{formatPrice(taxAmount)}</span>
            </div>
          )}
        </div>

        <Separator className="my-3 bg-primary-100" />

        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-primary-700">{formatPrice(Math.max(0, totalAmount))}</span>
        </div>

        {totalAmount > 0 && (
          <p className="mt-1 text-xs text-gray-400 text-right">Inclusive of all taxes</p>
        )}
      </div>
    </div>
  );
}
