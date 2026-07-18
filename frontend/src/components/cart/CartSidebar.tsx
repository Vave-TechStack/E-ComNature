'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Leaf, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeItem, updateQuantity, setCartOpen } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const dispatch = useAppDispatch();
  const { items, itemCount, totalAmount, isOpen } = useAppSelector((state) => state.cart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              {/* Header */}
              <div className="flex items-center justify-between border-b border-primary-100 px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-gray-900">Cart</span>
                    <span className="text-xs text-gray-500 ml-1.5">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => dispatch(setCartOpen(false))} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full h-9 w-9">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Items */}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 border-2 border-primary-100">
                    <ShoppingBag className="h-12 w-12 text-primary-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                  <p className="text-sm text-gray-500">Add some natural goodness!</p>
                  <Link href="/products" onClick={() => dispatch(setCartOpen(false))}>
                    <Button className="gap-2 gradient-primary text-white">
                      <Leaf className="h-4 w-4" />
                      Shop Natural Foods
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-4 py-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <motion.div
                          key={`${item.productId}-${item.variantId}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 rounded-xl border border-primary-100 bg-white p-3 hover:shadow-md transition-shadow"
                        >
                          {/* Image */}
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-primary-50">
                            <Image
                              src={item.productImage || '/images/placeholder.svg'}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.productName}
                              </p>
                              {item.variantInfo && (
                                <p className="text-xs text-gray-500">{item.variantInfo}</p>
                              )}
                              <p className="mt-1 text-sm font-bold text-primary-700">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-lg border border-primary-200 bg-white">
                                <button
                                  className="flex h-7 w-7 items-center justify-center text-primary-500 hover:text-primary-700 transition-colors rounded-l-lg"
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
                                <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold text-gray-900 border-x border-primary-100 bg-primary-50/30">
                                  {item.quantity}
                                </span>
                                <button
                                  className="flex h-7 w-7 items-center justify-center text-primary-500 hover:text-primary-700 transition-colors rounded-r-lg"
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
                                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                onClick={() => dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="border-t border-primary-100 bg-white px-4 py-4 space-y-4">
                    {/* Shipping progress */}
                    {totalAmount < 499 && (
                      <div className="rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Truck className="h-3 w-3 text-accent-500" />
                          <span className="text-[11px] font-medium text-primary-800">Free Shipping</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (totalAmount / 499) * 100)}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500"
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-gray-500">
                          Add <span className="font-semibold text-accent-600">{formatPrice(499 - totalAmount)}</span> more for free shipping!
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Subtotal</span>
                      <span className="text-lg font-bold text-primary-700">{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/cart" className="flex-1" onClick={() => dispatch(setCartOpen(false))}>
                        <Button variant="outline" className="w-full border-primary-200 text-primary-700 hover:bg-primary-50">
                          View Cart
                        </Button>
                      </Link>
                      <Link href="/checkout" className="flex-1" onClick={() => dispatch(setCartOpen(false))}>
                        <Button className="w-full gap-1 gradient-primary text-white">
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
