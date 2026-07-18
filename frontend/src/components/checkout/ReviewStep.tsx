'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Truck, CreditCard, Shield, Leaf, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
          <CheckCircle className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
          <p className="text-sm text-gray-500">Please verify your order details before placing</p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-primary-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-900">{items.length} Item{items.length > 1 ? 's' : ''} in your order</h3>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 p-3 rounded-xl bg-primary-50/50">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image src={item.productImage || '/images/placeholder.svg'} alt={item.productName} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                {item.variantInfo && <p className="text-xs text-gray-500">{item.variantInfo}</p>}
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-primary-700 shrink-0">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-primary-100 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary-600" />
            <span className="text-xs font-bold uppercase text-primary-600 tracking-wider">Delivering to</span>
          </div>
          <p className="text-sm font-medium text-gray-900">Rajesh Kumar</p>
          <p className="text-sm text-gray-600">42, MG Road, Indiranagar</p>
          <p className="text-sm text-gray-600">Bangalore, Karnataka - 560038</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-primary-600" />
            <span className="text-xs font-bold uppercase text-primary-600 tracking-wider">Shipping</span>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {selectedShipping === 'express' ? 'Express Delivery' : selectedShipping === 'same_day' ? 'Same Day Delivery' : 'Standard Delivery'}
          </p>
          <p className="text-sm text-gray-500">
            {selectedShipping === 'express' ? '2-3 days' : selectedShipping === 'same_day' ? 'Today' : '5-7 days'}
          </p>
        </div>
      </div>

      <PriceBreakdown subtotal={subtotal} shippingCharge={shippingCharge} totalAmount={total} freeShippingThreshold={499} />

      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
        <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 gap-2">← Back</Button>
        <Button onClick={onNext} disabled={isProcessing} className="gap-2 gradient-primary text-white px-10 h-12 text-base font-bold shadow-lg shadow-primary-200 disabled:opacity-50 rounded-xl">
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Place Order
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
