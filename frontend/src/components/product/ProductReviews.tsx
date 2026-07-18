'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Filter, ChevronDown } from 'lucide-react';
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

export function ProductReviews({ reviews, averageRating, ratingCount, ratingDistribution }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful': return b.helpfulCount - a.helpfulCount;
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      default: return 0;
    }
  });

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
          <div className="mt-2 flex items-center justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={cn('h-4 w-4', star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">{ratingCount} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0;
            const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 text-sm text-gray-600">{star}★</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    className="h-full rounded-full bg-yellow-400"
                  />
                </div>
                <span className="w-8 text-xs text-gray-500 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.profileImage} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">{getInitials(review.user.firstName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={cn('h-3.5 w-3.5', star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(review.createdAt, 'MMM dd, yyyy')}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {review.title && <p className="mt-3 text-sm font-semibold text-gray-900">{review.title}</p>}
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.review}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-3 flex gap-2">
                {review.images.map((img, i) => (
                  <div key={i} className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({review.helpfulCount})
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 5 && (
        <div className="text-center">
          <Button variant="outline" className="gap-2">Load More Reviews <ChevronDown className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}
