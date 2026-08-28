'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  priority?: boolean;
}

export function ProductCard({ product, variant = 'default', priority = false }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = calculateDiscount(product.basePrice, product.sellingPrice);
  const primaryImage = product.images?.find((img) => img.isPrimary)?.imageUrl
    || product.images?.[0]?.imageUrl
    || '/images/placeholder.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    dispatch(addItem({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage,
      quantity: 1,
      unitPrice: product.sellingPrice,
      totalPrice: product.sellingPrice,
      isSavedForLater: false,
      isGiftWrap: false,
    }));
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // ========== HORIZONTAL VARIANT ==========
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex gap-4 p-3 rounded-2xl border border-noble-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-noble-50">
          <Image src={primaryImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="96px" />
          {discount > 0 && (
            <Badge className="absolute left-1.5 top-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 border-0 font-semibold">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="text-sm font-heading text-noble-800 truncate leading-snug">{product.name}</p>
            {product.brand && (
              <p className="text-xs text-noble-400 mt-0.5">{product.brand.name}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-noble-900">{formatPrice(product.sellingPrice)}</span>
              {product.basePrice > product.sellingPrice && (
                <span className="text-xs text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent-500 text-accent-500" />
              <span className="text-xs text-noble-500">{product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ========== COMPACT VARIANT ==========
  if (variant === 'compact') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col items-center p-5 rounded-2xl border border-noble-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-xl bg-noble-50">
          <Image src={primaryImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="80px" />
        </div>
        <p className="text-sm font-heading text-noble-800 text-center line-clamp-2">{product.name}</p>
        <p className="mt-1 text-sm font-bold gradient-text">{formatPrice(product.sellingPrice)}</p>
      </Link>
    );
  }

  // ========== DEFAULT CARD ==========
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div
          className={cn(
            'relative rounded-2xl bg-white border overflow-hidden',
            'flex flex-col',
            'transition-all duration-300',
            isHovered
              ? 'border-primary-200 shadow-xl shadow-primary-900/5 -translate-y-1'
              : 'border-noble-200 shadow-sm hover:shadow-md'
          )}
        >
          {/* ===== IMAGE CONTAINER — Fixed 4:3 ratio ===== */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-noble-50 shrink-0">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority={priority}
              className={cn(
                'object-cover transition-transform duration-700',
                isHovered ? 'scale-108' : 'scale-100'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Subtle gradient on hover */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-500',
              isHovered ? 'opacity-100' : 'opacity-0'
            )} />

            {/* ===== BADGES ===== */}
            <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
              {discount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  -{discount}%
                </Badge>
              )}
              {product.isNewArrival && (
                <Badge className="bg-primary-600 text-white border-0 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  New
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-accent-600 text-white border-0 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  Best Seller
                </Badge>
              )}
            </div>

            {/* ===== WISHLIST + QUICK VIEW ===== */}
            <div className={cn(
              'absolute right-2.5 top-2.5 flex flex-col gap-1.5 z-10 transition-all duration-300',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
            )}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md transition-colors"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('h-3.5 w-3.5 transition-colors', isWishlisted ? 'fill-red-500 text-red-500' : 'text-noble-500')} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md transition-colors"
                aria-label="Quick view"
              >
                <Eye className="h-3.5 w-3.5 text-noble-500" />
              </motion.button>
            </div>

            {/* ===== QUICK ADD BUTTON ===== */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-0 p-2.5 z-10"
                >
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    className={cn(
                      'w-full font-semibold text-xs h-8 rounded-xl transition-all duration-300',
                      isAdded
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/95 backdrop-blur-sm text-noble-800 hover:bg-white shadow-lg'
                    )}
                  >
                    {isAdded ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />
                        Added!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Quick Add
                      </span>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="px-3.5 pt-3 pb-3.5 flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-1">
                {product.brand.name}
              </p>
            )}

            {/* Product Name — fixed 2 lines */}
            <h3 className="text-[13px] font-semibold text-noble-800 line-clamp-2 leading-[1.35] hover:text-primary-700 transition-colors min-h-[2.3rem]">
              {product.name}
            </h3>

            {/* Rating row */}
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-accent-500 text-accent-500" />
                <span className="text-[11px] font-semibold text-noble-600">{product.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-noble-300">·</span>
              <span className="text-[11px] text-noble-400">{product.ratingCount} reviews</span>
            </div>

            {/* Variant */}
            {product.variants?.[0] && (
              <p className="text-[11px] text-noble-400 mt-1">{product.variants[0].variantValue}</p>
            )}

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-base font-bold text-noble-900">{formatPrice(product.sellingPrice)}</span>
              {product.basePrice > product.sellingPrice && (
                <span className="text-xs text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
              )}
            </div>

            {/* Add to Cart */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="mt-2.5"
            >
              <Button
                onClick={handleAddToCart}
                className={cn(
                  'w-full gap-1.5 font-semibold text-[11px] h-9 rounded-xl transition-all duration-300',
                  isAdded
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                    : 'bg-noble-900 hover:bg-noble-800 text-white shadow-sm'
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </Link>
    </div>
  );
}
