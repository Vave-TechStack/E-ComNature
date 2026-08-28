'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Shield, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    title: 'Pure Forest Honey',
    subtitle: 'Direct from Tribal Harvesters',
    description: 'Hand-collected by tribal communities from deep forests. Unprocessed, unfiltered, and 100% pure. Taste the wild essence of nature.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=1920&q=85',
    link: '/products?category=honey',
    cta: 'Shop Honey',
    cta2: 'Explore All',
    tag: 'Wild Harvest · 100% Pure',
    highlightWords: ['Forest Honey'],
  },
  {
    id: 2,
    title: 'Organic Millets & Ancient Grains',
    subtitle: 'Naturally Grown · Chemical Free',
    description: 'Rediscover traditional millets, organic rice, and ancient grains grown without pesticides. Rich in fiber, protein, and tradition.',
    image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=1920',
    link: '/products?category=millets',
    cta: 'Browse Grains',
    cta2: 'View All',
    tag: 'Organic Certified · Farm Fresh',
    highlightWords: ['Organic Millets', 'Ancient Grains'],
  },
  {
    id: 3,
    title: 'Cold Pressed Wood Oils',
    subtitle: 'Traditional Ghani Method',
    description: 'Extracted using wooden presses at low temperatures to preserve all natural nutrients, flavor, and aroma.',
    image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=1920',
    link: '/products?category=oils',
    cta: 'Shop Oils',
    cta2: 'Learn More',
    tag: 'Wood Pressed · Chemical Free',
    highlightWords: ['Cold Pressed', 'Wood Oils'],
  },
  {
    id: 4,
    title: 'Natural Spices from Hill Regions',
    subtitle: 'Premium Quality · Rich Aroma',
    description: 'Authentic spices sourced directly from the hill regions of Meghalaya, Kerala, and the Western Ghats.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85',
    link: '/products?category=spices',
    cta: 'Explore Spices',
    cta2: 'Shop Now',
    tag: 'Direct from Farms · Premium Grade',
    highlightWords: ['Natural Spices', 'Hill Regions'],
  },
  {
    id: 5,
    title: 'Traditional Foods & A2 Ghee',
    subtitle: 'Bilona Method · Pure Desi',
    description: 'Traditional Bilona method A2 ghee from indigenous Gir cows. Traditional pickles, jaggery, and snacks made with love.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1920&q=85',
    link: '/products?category=ghee',
    cta: 'Shop Ghee',
    cta2: 'View All',
    tag: 'A2 Certified · Traditional Bilona',
    highlightWords: ['Traditional Foods', 'A2 Ghee'],
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

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
    if (isHovering) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovering]);

  const slide = slides[currentSlide];

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? '30%' : '-30%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d < 0 ? '15%' : '-15%',
      opacity: 0,
      scale: 0.98,
    }),
  };

  const titleWords = slide.title.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[85vh] w-full min-h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* Background Image with Parallax */}
            <motion.div
              className="absolute inset-0"
              style={{ scale: backgroundScale, y: backgroundY }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={currentSlide === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
            </motion.div>

            {/* Premium Gradient Overlay — earthy, warm dark */}
            <div className="absolute inset-0 bg-gradient-to-r from-noble-900/90 via-noble-900/70 to-noble-800/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-noble-900/60 via-transparent to-noble-900/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noble-900/80 via-noble-900/40 to-transparent" />

            {/* Subtle natural decorative elements */}
            <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-primary-700/8 blur-3xl" />
            <div className="absolute -left-32 bottom-0 w-72 h-72 rounded-full bg-accent-700/5 blur-3xl" />

            {/* Content */}
            <motion.div
              style={{ opacity: contentOpacity, y: contentY }}
              className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 max-w-7xl mx-auto"
            >
              {/* Tag Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/80 border border-white/10">
                  <Sparkles className="h-3 w-3 text-accent-400" />
                  {slide.tag}
                </span>
              </motion.div>

              {/* Title — serif display font */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.08] tracking-tight text-white">
                  {titleWords.map((word, i) => (
                    <span key={i}>
                      {slide.highlightWords.some(h => h.includes(word.replace(/[^a-zA-Z0-9]/g, ''))) ? (
                        <span className="text-accent-300">
                          {word}{' '}
                        </span>
                      ) : (
                        <span>{word}{' '}</span>
                      )}
                    </span>
                  ))}
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl font-light tracking-wide"
              >
                {slide.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-3 text-sm sm:text-base text-white/50 max-w-xl leading-relaxed hidden sm:block"
              >
                {slide.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="bg-accent-500 hover:bg-accent-600 text-noble-900 font-semibold px-8 h-13 text-base shadow-lg shadow-accent-500/20 transition-all duration-300 rounded-xl gap-2"
                  >
                    {slide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:text-white px-8 h-13 text-base font-medium rounded-xl"
                  >
                    {slide.cta2}
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-10 flex items-center gap-8 hidden md:flex"
              >
                {[
                  { icon: Leaf, text: '100% Natural', color: 'text-primary-400' },
                  { icon: Shield, text: 'Authenticity Guaranteed', color: 'text-accent-400' },
                  { icon: Sparkles, text: 'Direct from Farmers', color: 'text-amber-300' },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2 text-white/40 text-xs"
                  >
                    <item.icon className={cn('h-3.5 w-3.5', item.color)} />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur-md p-3 text-white border border-white/10 transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur-md p-3 text-white border border-white/10 transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2 hidden lg:block"
        >
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel" />
            </div>
            <span className="text-[10px] text-white/30 font-medium uppercase tracking-[0.2em]">Scroll</span>
          </div>
        </motion.div>

        {/* Pill Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 shadow-2xl">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'rounded-full transition-all duration-700',
                  index === currentSlide
                    ? 'w-10 h-2 bg-accent-500 shadow-lg shadow-accent-500/30'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="text-[10px] text-white/40 font-medium ml-1 border-l border-white/10 pl-3 tracking-wider">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
