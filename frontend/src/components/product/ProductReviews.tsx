'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ThumbsUp, ChevronDown, Filter, Camera, Verified, X, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatDate, getInitials } from '@/lib/utils';

interface Review {
  id: number;
  user: { firstName: string; lastName?: string; profileImage?: string };
  rating: number;
  title: string;
  review: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
  images?: string[];
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  ratingCount: number;
  ratingDistribution: Record<number, number>;
}

const starLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export function ProductReviews({
  reviews,
  averageRating,
  ratingCount,
  ratingDistribution,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const sortOptions = [
    { value: 'recent' as const, label: 'Most Recent' },
    { value: 'helpful' as const, label: 'Most Helpful' },
    { value: 'highest' as const, label: 'Highest Rated' },
    { value: 'lowest' as const, label: 'Lowest Rated' },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful': return b.helpfulCount - a.helpfulCount;
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      default: return 0;
    }
  });

  const getSortLabel = () => sortOptions.find(o => o.value === sortBy)?.label || 'Most Recent';

  const totalDistribution = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-noble-800 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-500" />
          Customer Reviews
        </h3>
      </div>

      {/* ===== RATING SUMMARY CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-6"
      >
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row gap-8">
          {/* Big rating number */}
          <div className="text-center sm:text-left shrink-0">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl font-bold text-noble-900">{averageRating.toFixed(1)}</span>
              <span className="text-lg text-noble-400">/ 5</span>
            </div>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: star * 0.05, type: 'spring', stiffness: 400 }}
                >
                  <Star
                    className={cn(
                      'h-5 w-5',
                      star <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-noble-200'
                    )}
                  />
                </motion.div>
              ))}
            </div>
            <p className="mt-1 text-sm text-noble-500 font-medium">{ratingCount} verified reviews</p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage = totalDistribution > 0 ? (count / totalDistribution) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 group">
                  <span className="w-12 text-xs font-medium text-noble-500 group-hover:text-noble-700 transition-colors">
                    {star} <span className="text-noble-300">★</span>
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-noble-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: (5 - star) * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 relative"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                  <span className="w-8 text-xs font-medium text-noble-400 text-right tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ===== SORT CONTROLS ===== */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-noble-500 font-medium">
          Showing <span className="text-noble-800 font-semibold">{sortedReviews.length}</span> reviews
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 rounded-xl border border-noble-200 bg-white px-3.5 py-2 text-sm font-medium text-noble-700 hover:border-noble-300 hover:shadow-sm transition-all"
          >
            <Filter className="h-3.5 w-3.5 text-noble-400" />
            {getSortLabel()}
            <motion.span
              animate={{ rotate: showSortMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3.5 w-3.5 text-noble-400" />
            </motion.span>
          </button>

          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                className="absolute right-0 top-full mt-1 w-44 origin-top-right rounded-xl border border-noble-200 bg-white shadow-xl shadow-noble-200/50 z-30 overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm transition-colors',
                      sortBy === opt.value
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-noble-600 hover:bg-noble-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== REVIEWS LIST ===== */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageSquare className="h-12 w-12 text-noble-200 mx-auto mb-3" />
              <p className="text-noble-500 font-medium">No reviews yet</p>
              <p className="text-sm text-noble-400 mt-1">Be the first to review this product!</p>
            </motion.div>
          ) : (
            sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="group relative rounded-2xl border border-noble-200 bg-white p-5 sm:p-6 hover:shadow-lg hover:border-noble-300 transition-all duration-300"
              >
                {/* Top section: User info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-noble-100">
                      <AvatarImage src={review.user.profileImage} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-semibold">
                        {getInitials(review.user.firstName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-noble-800">
                          {review.user.firstName} {review.user.lastName}
                        </p>
                        {review.isVerifiedPurchase && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-semibold text-green-700"
                          >
                            <Verified className="h-3 w-3" />
                            Verified
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-3.5 w-3.5',
                                star <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-noble-200'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-noble-400 font-medium">
                          {formatDate(review.createdAt, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review title */}
                {review.title && (
                  <p className="mt-3 text-sm font-bold text-noble-800">{review.title}</p>
                )}

                {/* Review content */}
                <p className="mt-1.5 text-sm text-noble-600 leading-relaxed">{review.review}</p>

                {/* Review images */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex gap-2.5">
                    {review.images.map((img, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLightboxImage(img)}
                        className="relative h-16 w-16 overflow-hidden rounded-[5px] bg-noble-100 border border-noble-200 cursor-pointer"
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Bottom actions */}
                <div className="mt-4 pt-3 border-t border-noble-100 flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 text-xs font-medium text-noble-400 hover:text-primary-600 transition-colors"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Helpful ({review.helpfulCount})
                  </motion.button>
                </div>

                {/* Hover gradient accent */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/0 via-transparent to-primary-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ===== LOAD MORE ===== */}
      {reviews.length > 5 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="rounded-xl gap-2 border-noble-200 text-noble-600 hover:bg-noble-50 hover:border-noble-300 px-6"
          >
            Load More Reviews
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ===== IMAGE LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all z-10"
              aria-label="Close image"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <motion.img
              key={lightboxImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImage}
              alt="Review image"
              className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
