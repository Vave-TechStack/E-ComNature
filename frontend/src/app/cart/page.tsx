'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Heart, Gift, ArrowRight, ChevronLeft, Leaf, Shield, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceBreakdown } from '@/components/cart/PriceBreakdown';
import { CouponInput } from '@/components/cart/CouponInput';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeItem, updateQuantity, toggleSaveForLater, clearCart, setCartOpen } from '@/store/slices/cartSlice';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types';

function CartItemRow({ item, onGiftWrapChange }: { item: CartItem; onGiftWrapChange: (productId: number, checked: boolean) => void }) {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4 rounded-2xl border border-primary-100 bg-white p-4 transition-all hover:shadow-lg hover:shadow-primary-100/50 sm:p-5"
    >
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:h-28 sm:w-28">
        <Image
          src={item.productImage || '/images/placeholder.svg'}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="112px"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.productId}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {item.productName}
          </Link>
          {item.variantInfo && (
            <p className="mt-0.5 text-xs text-gray-500">{item.variantInfo}</p>
          )}
          <p className="mt-1 text-base font-bold text-primary-700">
            {formatPrice(item.unitPrice)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls - Premium Style */}
          <div className="flex items-center rounded-xl border border-primary-200 bg-white shadow-sm">
            <button
              className="flex h-9 w-9 items-center justify-center text-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors rounded-l-xl"
              onClick={() => {
                if (item.quantity <= 1) {
                  dispatch(removeItem({ productId: item.productId, variantId: item.variantId }));
                } else {
                  dispatch(updateQuantity({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity - 1,
                  }));
                }
              }}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex h-9 w-10 items-center justify-center text-sm font-bold text-gray-900 border-x border-primary-100 bg-primary-50/30">
              {item.quantity}
            </span>
            <button
              className="flex h-9 w-9 items-center justify-center text-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors rounded-r-xl"
              onClick={() => dispatch(updateQuantity({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity + 1,
              }))}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Save for Later */}
            <button
              className={cn(
                'rounded-xl p-2.5 transition-all border',
                item.isSavedForLater
                  ? 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100'
                  : 'text-gray-400 border-transparent hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100'
              )}
              onClick={() => dispatch(toggleSaveForLater(item.productId))}
              title={item.isSavedForLater ? 'Remove from saved' : 'Save for later'}
              aria-label={item.isSavedForLater ? 'Remove from saved items' : 'Save for later'}
            >
              <Heart className={`h-4 w-4 ${item.isSavedForLater ? 'fill-red-500' : ''}`} />
            </button>

            {/* Remove */}
            <button
              className="rounded-xl p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
              onClick={() => dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))}
              title="Remove item"
              aria-label="Remove item from cart"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Gift Wrap Option */}
        <div className="mt-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500 hover:text-primary-600 transition-colors">
            <input
              type="checkbox"
              checked={item.isGiftWrap}
              onChange={(e) => onGiftWrapChange(item.productId, e.target.checked)}
              className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
            />
            <Gift className="h-3.5 w-3.5 text-accent-500" />
            Add natural gift wrap for {formatPrice(49)}
          </label>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, itemCount, totalAmount } = useAppSelector((state) => state.cart);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [giftWrapIds, setGiftWrapIds] = useState<Set<number>>(new Set());
  const shippingCharge = totalAmount >= 499 ? 0 : 49;
  const giftWrapCharge = giftWrapIds.size * 49;
  const gstRate = 0.05; // 5% GST on food products
  const gstAmount = Math.round(totalAmount * gstRate);
  const subtotal = totalAmount;
  const total = subtotal + shippingCharge + giftWrapCharge - couponDiscount + gstAmount;

  const handleGiftWrapChange = (productId: number, checked: boolean) => {
    setGiftWrapIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(productId);
      else next.delete(productId);
      return next;
    });
  };

  const handleApplyCoupon = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (code.toUpperCase() === 'SAVE50') {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(50);
    } else if (code.toUpperCase() === 'WELCOME20') {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(20);
    } else {
      throw new Error('Invalid coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
    setCouponDiscount(0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-natural">
        <div className="container-custom py-20">
          <EmptyState
            icon="cart"
            title="Your Cart is Empty"
            description="Looks like you haven't added any natural goodness yet! Browse our collection and find something you love."
            actions={[
              { label: 'Start Shopping', href: '/products', variant: 'default' },
              { label: 'Browse Trending →', href: '/products?sort=trending', variant: 'outline' },
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural">
      <CartSidebar />

      {/* Header */}
      <div className="border-b border-primary-100 bg-white">
        <div className="container-custom py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Your Cart</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-semibold text-primary-600">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2" onClick={() => dispatch(clearCart())}>
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onGiftWrapChange={handleGiftWrapChange}
              />
            ))}

            {/* Cross-Sell: Frequently Bought Together */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-accent-500" />
                <h3 className="text-sm font-bold text-gray-900">Frequently Bought Together</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { name: 'A2 Gir Cow Ghee', price: 899, img: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=200&q=80' },
                  { name: 'Lakadong Turmeric', price: 349, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80' },
                  { name: 'Cold Pressed Oil', price: 399, img: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=200' },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex shrink-0 flex-col items-center rounded-xl border border-primary-100 bg-white p-3 w-36 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-primary-50 mb-2 image-zoom">
                      <Image src={item.img} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <p className="text-xs font-medium text-gray-900 text-center line-clamp-2">{item.name}</p>
                    <p className="text-sm font-bold text-primary-700 mt-1">{formatPrice(item.price)}</p>
                    <Button size="xs" variant="outline" className="mt-1.5 text-[10px] h-6 px-2 border-primary-200 text-primary-600 hover:bg-primary-50 w-full">
                      + Add
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="pt-4 flex items-center justify-between">
              <Link href="/products">
                <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                  <ChevronLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <Shield className="h-3.5 w-3.5 text-primary-400" />
                Secure checkout
                <Sparkles className="h-3.5 w-3.5 text-accent-400 ml-2" />
                100% natural products
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Free Shipping Progress */}
            {subtotal < 499 && (
              <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-accent-600" />
                  <span className="text-xs font-medium text-primary-800">Free Shipping</span>
                </div>
                <div className="h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500" style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">Add {formatPrice(499 - subtotal)} more for <span className="font-semibold text-accent-600">free shipping</span>!</p>
              </div>
            )}

            {/* Coupon */}
            <CouponInput
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              appliedCoupon={appliedCoupon}
              discount={couponDiscount}
            />

            {/* Price Breakdown with GST */}
            <PriceBreakdown
              subtotal={subtotal}
              shippingCharge={shippingCharge}
              couponDiscount={couponDiscount}
              giftWrapCharge={giftWrapCharge}
              taxAmount={gstAmount}
              totalAmount={Math.max(0, total)}
              freeShippingThreshold={499}
            />

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button className="w-full h-13 text-base font-bold gap-2 gradient-primary text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all rounded-xl">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-primary-100 bg-white p-4">
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                    <Shield className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50">
                    <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-600">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-600">100% Natural</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
