'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';

const initialWishlistProducts = [
    {
      id: 1, name: 'Pure Forest Honey – Tribal Harvest', slug: 'pure-forest-honey',
      image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80',
      price: 599, originalPrice: 899, inStock: true, brand: 'Araku Tribal Co-op',
    },
    {
      id: 2, name: 'A2 Desi Cow Ghee – Bilona Method', slug: 'a2-desi-cow-ghee',
      image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400&q=80',
      price: 899, originalPrice: 1299, inStock: true, brand: 'Gir Farms',
    },
    {
      id: 3, name: 'Organic Turmeric Powder (Lakadong)', slug: 'organic-turmeric-lakadong',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
      price: 449, originalPrice: 599, inStock: false, brand: 'Meghalaya Organic',
    },
  ];

export default function WishlistPage() {
  const [wishlistEmpty, setWishlistEmpty] = useState(false);
  const wishlistProducts = wishlistEmpty ? [] : initialWishlistProducts;

  return (
    <div className="min-h-screen bg-natural">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-primary-600 font-medium">My Wishlist</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Saved Items</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 mt-1">{wishlistProducts.length} items saved</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 border-primary-200 text-primary-700">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon="wishlist"
                title="Your wishlist is empty"
                description="Save your favorite natural products and find them here. Start exploring our collection!"
                actions={[
                  { label: 'Discover Products', href: '/products', variant: 'default' },
                ]}
              />
            </div>
          ) : (
            /* Wishlist Items */
            <div className="space-y-4">
              {wishlistProducts.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-primary-100 p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <Link href={`/products/${item.slug}`} className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-primary-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-primary-600 font-medium">{item.brand}</p>
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors mt-0.5">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
                            <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                          </div>
                          <div className="mt-2">
                            {item.inStock ? (
                              <Badge className="bg-green-100 text-green-700 border-0 text-xs">In Stock</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-0 text-xs">Out of Stock</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button onClick={() => setWishlistEmpty(true)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        {item.inStock ? (
                          <Button size="sm" className="gap-2 gradient-primary text-white text-xs font-semibold">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Add to Cart
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="border-gray-200 text-gray-400 text-xs" disabled>
                            Out of Stock
                          </Button>
                        )}
                        <Link href={`/products/${item.slug}`}>
                          <Button size="sm" variant="outline" className="border-primary-200 text-primary-700 text-xs">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
