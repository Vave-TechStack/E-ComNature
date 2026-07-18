'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
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
  const discount = calculateDiscount(product.basePrice, product.sellingPrice);
  const primaryImage = product.images?.find((img) => img.isPrimary)?.imageUrl
    || product.images?.[0]?.imageUrl
    || '/images/placeholder.svg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/products/${product.slug}`} className="group flex gap-4 rounded-xl border border-gray-200 p-3 transition-all hover:shadow-md">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image src={primaryImage} alt={product.name} fill className="object-cover" />
          {discount > 0 && (
            <Badge className="absolute left-1 top-1 bg-red-500 text-[10px] px-1.5 py-0">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
            {product.brand && (
              <p className="text-xs text-gray-500">{product.brand.name}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
              {product.basePrice > product.sellingPrice && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">{product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.slug}`} className="group flex flex-col items-center rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md">
        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
          <Image src={primaryImage} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <p className="text-sm font-medium text-gray-900 text-center line-clamp-2">{product.name}</p>
        <p className="mt-1 text-sm font-bold text-primary-600">{formatPrice(product.sellingPrice)}</p>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-red-500 text-white border-0 text-xs font-semibold px-2 py-1">
                -{discount}%
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-emerald-500 text-white border-0 text-xs font-semibold px-2 py-1">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold px-2 py-1">
                Best Seller
              </Badge>
            )}
          </div>

          {/* Quick Action Buttons - Always visible on mobile, on hover on desktop */}
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
          {product.brand && (
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{product.brand.name}</p>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className={cn(
                'h-3.5 w-3.5',
                product.averageRating > 0 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
              )} />
              <span className="text-xs font-medium text-gray-700">{product.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-400">({product.ratingCount})</span>
          </div>

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.basePrice > product.sellingPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            size="sm"
            className="mt-2 w-full gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
