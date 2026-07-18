'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    title: 'Pure Forest Honey',
    subtitle: 'Direct from Tribal Harvesters',
    description: 'Hand-collected by tribal communities from deep forests. Unprocessed, unfiltered, and 100% pure. Taste the wild essence of nature.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=1920&q=85',
    overlay: 'from-primary-900/80 via-primary-800/60 to-transparent',
    link: '/products?category=honey',
    cta: 'Shop Honey',
    cta2: 'Explore Products',
    tag: 'Wild Harvest · 100% Pure',
  },
  {
    id: 2,
    title: 'Organic Millets & Ancient Grains',
    subtitle: 'Naturally Grown · Chemical Free',
    description: 'Rediscover traditional millets, organic rice, and ancient grains grown without pesticides. Rich in fiber, protein, and tradition.',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1920&q=85',
    overlay: 'from-amber-900/80 via-amber-800/60 to-transparent',
    link: '/products?category=millets',
    cta: 'Browse Grains',
    cta2: 'View All',
    tag: 'Organic Certified · Farm Fresh',
  },
  {
    id: 3,
    title: 'Cold Pressed Wood Oils',
    subtitle: 'Traditional Ghani Method',
    description: 'Extracted using wooden presses at low temperatures to preserve all natural nutrients, flavor, and aroma. No chemicals, no heat processing.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=85',
    overlay: 'from-emerald-900/80 via-emerald-800/60 to-transparent',
    link: '/products?category=oils',
    cta: 'Shop Oils',
    cta2: 'Learn More',
    tag: 'Wood Pressed · Chemical Free',
  },
  {
    id: 4,
    title: 'Natural Spices from Hill Regions',
    subtitle: 'Premium Quality · Rich Aroma',
    description: 'Authentic spices sourced directly from the hill regions of Meghalaya, Kerala, and the Western Ghats. Pure, unadulterated, and aromatic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85',
    overlay: 'from-red-900/80 via-red-800/60 to-transparent',
    link: '/products?category=spices',
    cta: 'Explore Spices',
    cta2: 'Shop Now',
    tag: 'Direct from Farms · Premium Grade',
  },
  {
    id: 5,
    title: 'Fresh from Hill Farmers',
    subtitle: 'Supporting Tribal Communities',
    description: 'Every purchase supports tribal farmers, rural women, and traditional artisans. Bringing the purest foods from nature\'s bounty to your home.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=85',
    overlay: 'from-green-900/80 via-green-800/60 to-transparent',
    link: '/products',
    cta: 'Shop All Products',
    cta2: 'Our Story',
    tag: 'Farm to Home · Empowering Communities',
  },
  {
    id: 6,
    title: 'Traditional Foods & A2 Ghee',
    subtitle: 'Bilona Method · Pure Desi',
    description: 'Traditional Bilona method A2 ghee from indigenous Gir cows. Traditional pickles, jaggery, and snacks made with love by village communities.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1920&q=85',
    overlay: 'from-amber-900/80 via-amber-800/60 to-transparent',
    link: '/products?category=ghee',
    cta: 'Shop Ghee',
    cta2: 'View All',
    tag: 'A2 Certified · Traditional Bilona',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] sm:h-[520px] md:h-[600px] lg:h-[680px] xl:h-[750px] w-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={currentSlide === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}

              />
            </div>

            {/* Gradient Overlay */}
            <div className={cn('absolute inset-0 bg-gradient-to-r', slide.overlay)} />

            {/* Bottom gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 max-w-7xl mx-auto">
              {/* Tag Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white border border-white/20">
                  <Sparkles className="h-3 w-3 text-accent-300" />
                  {slide.tag}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white max-w-3xl leading-tight tracking-tight"
              >
                {slide.title.split(' ').map((word, i) => {
                  const isHighlight = word === 'Honey' || word === 'Millets' || word === 'Oils' || word === 'Spices' || word === 'Farmers' || word === 'Ghee';
                  return (
                    <span key={i}>
                      {isHighlight ? (
                        <span className="text-accent-300">{word} </span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  );
                })}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-2 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-medium"
              >
                {slide.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-3 text-sm sm:text-base text-white/60 max-w-xl leading-relaxed hidden sm:block"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 h-12 text-base shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-300"
                  >
                    {slide.cta}
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="border-2 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white px-8 h-12 text-base font-semibold shadow-lg"
                  >
                    {slide.cta2}
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-10 flex items-center gap-6 hidden md:flex"
              >
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Leaf className="h-3.5 w-3.5 text-green-300" />
                  <span>100% Organic</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Shield className="h-3.5 w-3.5 text-accent-300" />
                  <span>Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Direct from Farmers</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 border border-white/20 hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 border border-white/20 hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scroll Indicator - animated bouncing arrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Scroll</span>
            <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Dots - Premium Pill Style */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'rounded-full transition-all duration-500',
                  index === currentSlide
                    ? 'w-8 h-2 bg-accent-400 shadow-lg shadow-accent-400/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="text-[10px] text-white/40 font-medium ml-1 border-l border-white/10 pl-2.5">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
