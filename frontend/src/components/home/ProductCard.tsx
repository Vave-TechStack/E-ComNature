'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Eye, Check, ArrowRight } from 'lucide-react';
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

function useTiltEffect(ref: React.RefObject<HTMLDivElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / rect.width;
    const distY = (e.clientY - centerY) / rect.height;
    x.set(distX * 8);
    y.set(distY * -8);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { springX, springY, handleMouseMove, handleMouseLeave };
}

export function ProductCard({ product, variant = 'default', priority = false }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { springX, springY, handleMouseMove, handleMouseLeave: tiltLeave } = useTiltEffect(cardRef);

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

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex gap-4 p-3 rounded-2xl border border-noble-200 dark:border-noble-700 bg-white dark:bg-noble-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[5px] bg-noble-100 dark:bg-noble-700">
          <Image src={primaryImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="96px" />
          {discount > 0 && (
            <Badge className="absolute left-1 top-1 bg-gradient-to-r from-red-500 to-rose-500 text-[10px] px-1.5 py-0.5 border-0">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="text-sm font-semibold text-noble-800 dark:text-noble-200 truncate">{product.name}</p>
            {product.brand && (
              <p className="text-xs text-noble-400 mt-0.5">{product.brand.name}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-noble-900 dark:text-white">{formatPrice(product.sellingPrice)}</span>
              {product.basePrice > product.sellingPrice && (
                <span className="text-xs text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
              <span className="text-xs text-noble-500">{product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col items-center p-5 rounded-2xl border border-noble-200 dark:border-noble-700 bg-white dark:bg-noble-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-[5px] bg-noble-100 dark:bg-noble-700">
          <Image src={primaryImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="80px" />
        </div>
        <p className="text-sm font-semibold text-noble-800 dark:text-noble-200 text-center line-clamp-2">{product.name}</p>
        <p className="mt-1 text-sm font-bold gradient-text">{formatPrice(product.sellingPrice)}</p>
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); tiltLeave(); }}
      onMouseMove={handleMouseMove}
      className="group perspective-[1000px] h-full"
    >
      <motion.div
        style={{ rotateX: springY, rotateY: springX }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className={cn(
          'relative rounded-2xl bg-white dark:bg-noble-800 border transition-all duration-500 overflow-hidden',
          'flex flex-col h-full min-h-[340px] sm:min-h-[360px]',
          isHovered
            ? 'border-primary-200/50 dark:border-primary-700/50 shadow-2xl shadow-primary-500/8 -translate-y-1'
            : 'border-noble-200 dark:border-noble-700 shadow-sm hover:shadow-lg'
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-[5px] bg-noble-100 dark:bg-noble-700 shrink-0">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            className={cn(
              'object-cover transition-all duration-700',
              isHovered ? 'scale-110' : 'scale-100'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />

          {/* Gradient Overlay on Hover */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )} />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 text-xs font-bold px-2.5 py-1 shadow-lg shadow-red-500/30">
                  -{discount}%
                </Badge>
              </motion.div>
            )}
            {product.isNewArrival && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-xs font-bold px-2.5 py-1 shadow-lg shadow-emerald-500/30">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs font-bold px-2.5 py-1 shadow-lg shadow-amber-500/30">
                Best Seller
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={cn(
            'absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 z-10',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          )}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-4 w-4 transition-colors', isWishlisted ? 'fill-red-500 text-red-500' : 'text-noble-600')} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-colors"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 text-noble-600" />
            </motion.button>
          </div>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute inset-x-0 bottom-0 p-3 z-10"
              >
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className={cn(
                    'w-full font-semibold text-xs h-9 rounded-xl transition-all duration-300',
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/95 backdrop-blur-sm text-noble-800 hover:bg-white shadow-lg'
                  )}
                >
                  {isAdded ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      Added
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

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {product.brand && (
            <p className="text-[11px] font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-1">
              {product.brand.name}
            </p>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-noble-800 dark:text-noble-200 line-clamp-2 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              <Star className={cn(
                'h-3.5 w-3.5',
                product.averageRating > 0 ? 'fill-accent-400 text-accent-400' : 'fill-noble-200 text-noble-200'
              )} />
              <span className="text-xs font-semibold text-noble-600">{product.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-noble-400">({product.ratingCount})</span>
            <span className="text-xs text-noble-300 mx-1">·</span>
            <span className="text-xs text-noble-400">{product.totalSold}+ sold</span>
          </div>

          {/* Variant size */}
          {product.variants?.[0] && (
            <p className="text-xs text-noble-400 mt-1.5">{product.variants[0].variantValue}</p>
          )}

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-noble-900 dark:text-white">{formatPrice(product.sellingPrice)}</span>
            {product.basePrice > product.sellingPrice && (
              <span className="text-sm text-noble-400 line-through">{formatPrice(product.basePrice)}</span>
            )}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* Add to Cart Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleAddToCart}
              className={cn(
                'mt-3 w-full gap-2 font-semibold text-xs h-10 rounded-xl transition-all duration-300',
                isAdded
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-noble-900 hover:bg-noble-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white shadow-md'
              )}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
