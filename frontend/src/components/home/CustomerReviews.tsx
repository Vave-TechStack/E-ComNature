'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    text: "The forest honey from Araku is unlike anything I've ever tasted. Pure, raw, and incredibly flavorful. My entire family has switched to this, and we've noticed a remarkable difference in our immunity. This is what real honey should taste like!",
    rating: 5,
    product: 'Forest Honey',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Bangalore, Karnataka',
    text: "Switched to their cold-pressed groundnut oil and A2 ghee three months ago. The difference in taste is remarkable — my cooking has never been better. More importantly, I can feel the health benefits. Highly recommended for every Indian kitchen!",
    rating: 5,
    product: 'Cold Pressed Oils',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Hyderabad, Telangana',
    text: "The Lakadong turmeric is absolute gold! My curries have a beautiful color and the flavor is incomparable. I've been using it daily and my joint pain has significantly reduced. This is the real deal — 7-12% curcumin content makes all the difference.",
    rating: 5,
    product: 'Lakadong Turmeric',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    date: '3 weeks ago',
  },
  {
    id: 4,
    name: 'Vikram Patel',
    location: 'Ahmedabad, Gujarat',
    text: "Finally, a place where I can trust the authenticity of organic products. The foxtail millet and traditional rice varieties are superb. My diabetic father has benefited tremendously from switching to their millets. Thank you for bringing real food to our table!",
    rating: 5,
    product: 'Organic Millets',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    date: '1 month ago',
  },
  {
    id: 5,
    name: 'Meera Nair',
    location: 'Kochi, Kerala',
    text: "Their herbal green tea blend with tulsi and ginger is my morning ritual now. The quality is exceptional — you can actually taste the fresh herbs. My go-to for immunity and overall wellness. The 200g pack lasts me a month of daily use.",
    rating: 4,
    product: 'Herbal Green Tea',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    date: '2 weeks ago',
  },
  {
    id: 6,
    name: 'Arjun Singh',
    location: 'Delhi NCR',
    text: "The traditional mango pickle from Andhra is simply outstanding! It tastes exactly like my grandmother used to make. No preservatives, authentic spices, and that perfect tanginess. Ordering my third jar now. A must-try for pickle lovers!",
    rating: 5,
    product: 'Mango Pickle',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    date: '1 week ago',
  },
];

const reviewsPerPage = 3;

export function CustomerReviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = useCallback(() => setCurrentPage((prev) => (prev + 1) % totalPages), [totalPages]);
  const prevPage = useCallback(() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages), [totalPages]);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextPage, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextPage]);

  // Pause auto-play on hover over the section
  const reviewsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = reviewsRef.current;
    if (!el) return;
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section ref={reviewsRef} className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50/50 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-1 w-6 rounded-full bg-accent-500" />
            <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest">Testimonials</span>
            <span className="h-1 w-6 rounded-full bg-accent-500" />
          </div>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Real stories from real people who made the switch to pure, natural, and chemical-free foods
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-5 md:gap-6"
            >
              {visibleReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-2xl p-6 md:p-7 border border-primary-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
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
                          s < review.rating ? 'fill-accent-400 text-accent-400' : 'fill-gray-200 text-gray-200'
                        )}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Rating */}
                  <div className="text-xs font-medium text-accent-600 mb-3">
                    Rated {review.rating}/5 · {review.product}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-primary-100/50">
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
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.location}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-gray-400">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevPage}
              className="rounded-full h-9 w-9 flex items-center justify-center bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentPage
                      ? 'w-7 h-2 bg-primary-600'
                      : 'w-2 h-2 bg-primary-200 hover:bg-primary-300'
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              className="rounded-full h-9 w-9 flex items-center justify-center bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
