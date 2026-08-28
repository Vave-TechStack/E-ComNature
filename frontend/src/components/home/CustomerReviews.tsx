'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  product: string;
  image: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1, name: 'Priya Sharma', location: 'Mumbai, Maharashtra',
    text: "The forest honey from Araku is unlike anything I've ever tasted. Pure, raw, and incredibly flavorful. My entire family has switched to this, and we've noticed a remarkable difference in our immunity.",
    rating: 5, product: 'Forest Honey',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', date: '2 weeks ago',
  },
  {
    id: 2, name: 'Rajesh Kumar', location: 'Bangalore, Karnataka',
    text: "Switched to their cold-pressed groundnut oil and A2 ghee three months ago. The difference in taste is remarkable — my cooking has never been better. More importantly, I can feel the health benefits.",
    rating: 5, product: 'Cold Pressed Oils',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', date: '1 month ago',
  },
  {
    id: 3, name: 'Ananya Reddy', location: 'Hyderabad, Telangana',
    text: "The Lakadong turmeric is absolute gold! My curries have a beautiful color and the flavor is incomparable. I've been using it daily and my joint pain has significantly reduced.",
    rating: 5, product: 'Lakadong Turmeric',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', date: '3 weeks ago',
  },
  {
    id: 4, name: 'Vikram Patel', location: 'Ahmedabad, Gujarat',
    text: "Finally, a place where I can trust the authenticity of organic products. The foxtail millet and traditional rice varieties are superb. My diabetic father has benefited tremendously.",
    rating: 5, product: 'Organic Millets',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', date: '1 month ago',
  },
  {
    id: 5, name: 'Meera Nair', location: 'Kochi, Kerala',
    text: "Their herbal green tea blend with tulsi and ginger is my morning ritual now. The quality is exceptional — you can actually taste the fresh herbs. My go-to for immunity and overall wellness.",
    rating: 4, product: 'Herbal Green Tea',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', date: '2 weeks ago',
  },
  {
    id: 6, name: 'Arjun Singh', location: 'Delhi NCR',
    text: "The traditional mango pickle from Andhra is simply outstanding! No preservatives, authentic spices, and that perfect tanginess. Ordering my third jar now. A must-try for pickle lovers!",
    rating: 5, product: 'Mango Pickle',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', date: '1 week ago',
  },
];

const reviewsPerPage = 3;

export function CustomerReviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  const nextPage = useCallback(() => setCurrentPage((prev) => (prev + 1) % totalPages), [totalPages]);
  const prevPage = useCallback(() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages), [totalPages]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextPage, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextPage]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)} className="section-padding bg-noble-50 overflow-hidden">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="divider-accent" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-[0.15em]">Testimonials</span>
            <span className="divider-accent" />
          </motion.div>
          <h2 className="heading-md text-noble-900">What Our Customers Say</h2>
          <p className="mt-3 text-noble-400 max-w-2xl mx-auto text-sm">
            Real stories from real people who made the switch to pure, natural, and chemical-free foods
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid md:grid-cols-3 gap-5 md:gap-6"
            >
              {visibleReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  className="card-premium p-6 md:p-7 relative group flex flex-col h-full"
                >
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary-100 absolute top-4 right-4 group-hover:text-primary-200 transition-colors" />

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={cn(
                          'h-4 w-4',
                          s < review.rating ? 'fill-accent-500 text-accent-500' : 'fill-noble-200 text-noble-200'
                        )}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-noble-500 leading-relaxed mb-5 line-clamp-4 flex-1">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Product Badge */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary-600 mb-4 bg-secondary-50 rounded-full px-3 py-1 w-fit">
                    <Sparkles className="h-3 w-3" />
                    {review.product}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-noble-100">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-primary-100">
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-noble-800">{review.name}</p>
                      <p className="text-xs text-noble-400">{review.location}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-noble-300">{review.date}</span>
                  </div>

                  {/* Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevPage}
              className="rounded-xl h-10 w-10 flex items-center justify-center bg-white text-noble-500 hover:text-primary-600 hover:bg-primary-50 transition-all border border-noble-200 shadow-sm"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <div className="flex items-center gap-2.5 bg-noble-100 rounded-full px-4 py-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    'rounded-full transition-all duration-500',
                    i === currentPage
                      ? 'w-8 h-2 bg-primary-500 shadow-sm shadow-primary-500/30'
                      : 'w-2 h-2 bg-noble-300 hover:bg-primary-300'
                  )}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextPage}
              className="rounded-xl h-10 w-10 flex items-center justify-center bg-white text-noble-500 hover:text-primary-600 hover:bg-primary-50 transition-all border border-noble-200 shadow-sm"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
