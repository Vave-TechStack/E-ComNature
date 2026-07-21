'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Leaf, ChevronRight, Truck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeItem, updateQuantity, setCartOpen } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const dispatch = useAppDispatch();
  const { items, itemCount, totalAmount, isOpen } = useAppSelector((state) => state.cart);

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);
  const shippingProgress = Math.min(100, (totalAmount / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => dispatch(setCartOpen(false))}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* ===== HEADER ===== */}
              <div className="flex items-center justify-between border-b border-noble-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-emerald-500 shadow-sm">
                    <ShoppingBag className="h-5 w-5 text-white" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white shadow-md">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-base font-bold text-noble-800">Your Cart</span>
                    <span className="text-xs text-noble-400 ml-1.5">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(setCartOpen(false))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-noble-400 hover:text-noble-600 hover:bg-noble-100 transition-all"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ===== FREE SHIPPING PROGRESS ===== */}
              {items.length > 0 && remainingForFreeShipping > 0 && (
                <div className="mx-5 mt-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200/60 p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Truck className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">Free Shipping</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/80 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-amber-600 font-medium">
                    Add <span className="font-bold text-amber-700">{formatPrice(remainingForFreeShipping)}</span> more for
                    <span className="font-bold text-amber-700"> free delivery</span>!
                  </p>
                </div>
              )}

              {items.length === 0 && shippingProgress >= 100 && (
                <div className="mx-5 mt-4 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/60 p-3.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-bold text-green-700">You've earned FREE shipping! 🎉</span>
                  </div>
                </div>
              )}

              {/* ===== EMPTY STATE ===== */}
              {items.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-noble-50 border-2 border-noble-200"
                  >
                    <ShoppingBag className="h-14 w-14 text-noble-300" />
                  </motion.div>
                  <p className="text-lg font-bold text-noble-800">Your cart is empty</p>
                  <p className="text-sm text-noble-400 text-center max-w-xs">
                    Looks like you haven't added anything yet. Explore our natural collection!
                  </p>
                  <Link href="/products" onClick={() => dispatch(setCartOpen(false))}>
                    <Button className="gap-2 gradient-primary text-white shadow-lg shadow-primary-200/50 rounded-xl">
                      <Sparkles className="h-4 w-4" />
                      Shop Natural Foods
                    </Button>
                  </Link>
                </div>
              )}

              {/* ===== ITEMS LIST ===== */}
              {items.length > 0 && (
                <>
                  <ScrollArea className="flex-1 px-5 py-4">
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <motion.div
                            key={`${item.productId}-${item.variantId}`}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            className="group relative flex gap-3.5 rounded-xl border border-noble-200 bg-white p-3.5 hover:shadow-md hover:border-noble-300 transition-all duration-200"
                          >
                            {/* Image */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[5px] bg-noble-50"
                            >
                              <Image
                                src={item.productImage || '/images/placeholder.svg'}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </motion.div>

                            {/* Details */}
                            <div className="flex flex-1 flex-col justify-between min-w-0">
                              <div className="pr-6">
                                <p className="text-sm font-semibold text-noble-800 truncate leading-snug">
                                  {item.productName}
                                </p>
                                {item.variantInfo && (
                                  <p className="text-xs text-noble-400 mt-0.5">{item.variantInfo}</p>
                                )}
                                <p className="mt-1 text-sm font-bold text-primary-600">
                                  {formatPrice(item.totalPrice)}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center rounded-lg border border-noble-200 bg-white overflow-hidden">
                                  <button
                                    className="flex h-8 w-8 items-center justify-center text-noble-500 hover:text-noble-700 hover:bg-noble-50 transition-colors"
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
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <motion.span
                                    key={item.quantity}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="flex h-8 w-9 items-center justify-center text-xs font-bold text-noble-800 border-x border-noble-200 bg-noble-50/30"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                  <button
                                    className="flex h-8 w-8 items-center justify-center text-noble-500 hover:text-noble-700 hover:bg-noble-50 transition-colors"
                                    onClick={() => dispatch(updateQuantity({
                                      productId: item.productId,
                                      variantId: item.variantId,
                                      quantity: item.quantity + 1,
                                    }))}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                {/* Remove */}
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                  onClick={() => dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>

                  {/* ===== FOOTER ===== */}
                  <div className="border-t border-noble-200 bg-white px-5 py-4 space-y-4">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-noble-500">Subtotal</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-noble-800">{formatPrice(totalAmount)}</span>
                        <p className="text-[10px] text-noble-400">Inclusive of all taxes</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href="/cart"
                        className="flex-1"
                        onClick={() => dispatch(setCartOpen(false))}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-noble-200 text-noble-600 hover:bg-noble-50 hover:border-noble-300 rounded-xl"
                        >
                          View Cart
                        </Button>
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex-1"
                        onClick={() => dispatch(setCartOpen(false))}
                      >
                        <Button className="w-full gap-1 gradient-primary text-white shadow-lg shadow-primary-200/50 rounded-xl">
                          Checkout <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
