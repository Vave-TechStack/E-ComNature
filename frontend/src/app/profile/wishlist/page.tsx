'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Star, Share2, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice, cn } from '@/lib/utils';

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  discount: number;
  addedAt: string;
}

const initialWishlist: WishlistItem[] = [
  { id: 1, name: 'Premium Wireless Noise Cancellation Headphones', brand: 'Sony', price: 24999, originalPrice: 34999, rating: 4.5, reviewCount: 2341, image: '/images/products/headphones.jpg', inStock: true, discount: 29, addedAt: '2026-01-10' },
  { id: 2, name: 'Ultra-Slim Smartwatch with AMOLED Display', brand: 'Apple', price: 45999, originalPrice: 52999, rating: 4.7, reviewCount: 1823, image: '/images/products/watch.jpg', inStock: true, discount: 13, addedAt: '2026-01-08' },
  { id: 3, name: 'Professional DSLR Camera 4K Video', brand: 'Canon', price: 89999, originalPrice: 99999, rating: 4.6, reviewCount: 987, image: '/images/products/camera.jpg', inStock: false, discount: 10, addedAt: '2026-01-05' },
  { id: 4, name: 'Ergonomic Office Chair with Lumbar Support', brand: 'Herman Miller', price: 79999, originalPrice: 89999, rating: 4.4, reviewCount: 654, image: '/images/products/chair.jpg', inStock: true, discount: 11, addedAt: '2026-01-03' },
  { id: 5, name: 'Mechanical Gaming Keyboard RGB', brand: 'Razer', price: 12999, originalPrice: 15999, rating: 4.3, reviewCount: 3210, image: '/images/products/keyboard.jpg', inStock: true, discount: 19, addedAt: '2025-12-28' },
  { id: 6, name: 'Portable Bluetooth Speaker Waterproof', brand: 'JBL', price: 7999, originalPrice: 9999, rating: 4.8, reviewCount: 5678, image: '/images/products/speaker.jpg', inStock: false, discount: 20, addedAt: '2025-12-25' },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInStock, setFilterInStock] = useState(false);

  const filteredWishlist = wishlist.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = filterInStock ? item.inStock : true;
    return matchesSearch && matchesStock;
  });

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const moveToCart = (id: number) => {
    // In production, dispatch Redux action
    removeFromWishlist(id);
  };

  const clearAll = () => {
    setWishlist([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Wishlist</h2>
          <p className="text-sm text-gray-500">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2', filterInStock && 'border-primary-500 text-primary-600 bg-primary-50')}
            onClick={() => setFilterInStock(!filterInStock)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            In Stock Only
          </Button>
          {wishlist.length > 0 && (
            <Button variant="ghost" size="sm" className="text-red-500 gap-2" onClick={clearAll}>
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <EmptyState
          icon="wishlist"
          title="Your wishlist is empty"
          description="Save your favorite items and find them here. Start exploring our collection!"
          actions={[
            { label: 'Discover Products', href: '/products', variant: 'default' },
          ]}
        />
      ) : filteredWishlist.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon="search"
            title="No items match your search"
            description="Try a different search query or adjust your filters."
            actions={[
              { label: 'Clear Filters', onClick: () => { setSearchQuery(''); setFilterInStock(false); }, variant: 'default' },
            ]}
          />
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredWishlist.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Discount Badge */}
                <Badge className="absolute left-3 top-3 z-10 bg-red-500 text-white border-0">
                  -{item.discount}%
                </Badge>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 shadow-sm hover:bg-red-50 transition-all duration-200"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Product Image */}
                <Link href={`/products/${item.id}`} className="block">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <div className="flex h-full items-center justify-center p-8">
                      <div className="h-full w-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.brand}</p>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-xs font-medium text-gray-700">{item.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({item.reviewCount.toLocaleString()})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{formatPrice(item.price)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                  </div>

                  {/* Stock Status */}
                  <p className={cn('mt-1 text-xs', item.inStock ? 'text-green-600' : 'text-red-500')}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-2 gradient-primary"
                      disabled={!item.inStock}
                      onClick={() => moveToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      aria-label={`Share ${item.name}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Date Added */}
                  <p className="mt-2 text-xs text-gray-400">
                    Added {new Date(item.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Share Wishlist CTA */}
      {wishlist.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">Share your wishlist with friends and family!</p>
          <Button variant="outline" size="sm" className="mt-2 gap-2">
            <Share2 className="h-4 w-4" /> Share Wishlist
          </Button>
        </div>
      )}
    </div>
  );
}
