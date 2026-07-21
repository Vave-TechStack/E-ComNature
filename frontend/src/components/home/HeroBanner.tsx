'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Shield, ArrowDown } from 'lucide-react';
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
    cta2: 'Explore Products',
    tag: 'Wild Harvest · 100% Pure',
    highlightWords: ['Forest Honey'],
  },
  {
    id: 2,
    title: 'Organic Millets\n& Ancient Grains',
    subtitle: 'Naturally Grown · Chemical Free',
    description: 'Rediscover traditional millets, organic rice, and ancient grains grown without pesticides. Rich in fiber, protein, and tradition.',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1920&q=85',
    link: '/products?category=millets',
    cta: 'Browse Grains',
    cta2: 'View All',
    tag: 'Organic Certified · Farm Fresh',
    highlightWords: ['Organic Millets', 'Ancient Grains'],
  },
  {
    id: 3,
    title: 'Cold Pressed\nWood Oils',
    subtitle: 'Traditional Ghani Method',
    description: 'Extracted using wooden presses at low temperatures to preserve all natural nutrients, flavor, and aroma. No chemicals, no heat processing.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=85',
    link: '/products?category=oils',
    cta: 'Shop Oils',
    cta2: 'Learn More',
    tag: 'Wood Pressed · Chemical Free',
    highlightWords: ['Cold Pressed', 'Wood Oils'],
  },
  {
    id: 4,
    title: 'Natural Spices\nfrom Hill Regions',
    subtitle: 'Premium Quality · Rich Aroma',
    description: 'Authentic spices sourced directly from the hill regions of Meghalaya, Kerala, and the Western Ghats. Pure, unadulterated, and aromatic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85',
    link: '/products?category=spices',
    cta: 'Explore Spices',
    cta2: 'Shop Now',
    tag: 'Direct from Farms · Premium Grade',
    highlightWords: ['Natural Spices', 'Hill Regions'],
  },
  {
    id: 5,
    title: 'Traditional Foods\n& A2 Ghee',
    subtitle: 'Bilona Method · Pure Desi',
    description: 'Traditional Bilona method A2 ghee from indigenous Gir cows. Traditional pickles, jaggery, and snacks made with love by village communities.',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1920&q=85',
    link: '/products?category=ghee',
    cta: 'Shop Ghee',
    cta2: 'View All',
    tag: 'A2 Certified · Traditional Bilona',
    highlightWords: ['Traditional Foods', 'A2 Ghee'],
  },
];

function MagneticButton({ children, className, href, ...props }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    x.set(distX * 0.15);
    y.set(distY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            background: i % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(251,191,36,0.12)',
            left: `${15 + i * 14}%`,
            top: `${20 + (i * 11) % 60}%`,
          }}
          animate={{
            y: [0, -30 - i * 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

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

  const titleLines = slide.title.split('\n');

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

            {/* Premium Gradient Overlay — layered for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-800/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-emerald-900/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-emerald-950/80 via-emerald-900/40 to-transparent" />

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Animated gradient orb */}
            <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -left-40 bottom-0 w-80 h-80 rounded-full bg-accent-500/8 blur-3xl" />

            {/* Content */}
            <motion.div
              style={{ opacity: contentOpacity, y: contentY }}
              className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 max-w-7xl mx-auto"
            >
              {/* Tag Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/90 border border-white/15 shadow-lg">
                  <Sparkles className="h-3 w-3 text-accent-300" />
                  {slide.tag}
                </span>
              </motion.div>

              {/* Title — multi-line support */}
              <motion.div
                initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                {titleLines.map((line, i) => {
                  const words = line.split(' ');
                  return (
                    <div key={i} className="overflow-hidden">
                      <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                        {words.map((word, j) => (
                          <span key={j}>
                            {slide.highlightWords.some(h => h.includes(word.replace(/[^a-zA-Z0-9]/g, ''))) ? (
                              <span className="text-gradient bg-gradient-to-r from-accent-200 via-accent-300 to-yellow-200">
                                {word}{' '}
                              </span>
                            ) : (
                              <span>{word}{' '}</span>
                            )}
                          </span>
                        ))}
                      </h1>
                    </div>
                  );
                })}
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl font-medium tracking-tight"
              >
                {slide.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-3 text-sm sm:text-base text-white/60 max-w-xl leading-relaxed hidden sm:block"
              >
                {slide.description}
              </motion.p>

              {/* CTA Buttons with Magnetic Effect */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <MagneticButton href={slide.link}>
                  <Button
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold px-8 h-12 text-base shadow-2xl shadow-accent-500/30 hover:shadow-accent-500/50 transition-all duration-300 rounded-xl"
                  >
                    <span className="relative z-10">{slide.cta}</span>
                  </Button>
                </MagneticButton>
                <MagneticButton href="/products">
                  <Button
                    size="lg"
                    className="btn-premium border-2 border-white/25 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white px-8 h-12 text-base font-semibold shadow-lg rounded-xl"
                  >
                    <span className="relative z-10">{slide.cta2}</span>
                  </Button>
                </MagneticButton>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-10 flex items-center gap-6 hidden md:flex"
              >
                {[
                  { icon: Leaf, text: '100% Organic', color: 'text-emerald-300' },
                  { icon: Shield, text: 'Authenticity Guaranteed', color: 'text-accent-300' },
                  { icon: Sparkles, text: 'Direct from Farmers', color: 'text-yellow-300' },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2 text-white/50 text-xs"
                  >
                    <item.icon className={cn('h-3.5 w-3.5', item.color)} />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows — Glass styled */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 z-20 -translate-y-1/2 rounded-full glass-strong p-3 text-emerald-800 backdrop-blur-md transition-all hover:scale-110 hover:shadow-xl active:scale-95 border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 z-20 -translate-y-1/2 rounded-full glass-strong p-3 text-emerald-800 backdrop-blur-md transition-all hover:scale-110 hover:shadow-xl active:scale-95 border border-white/20"
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

        {/* Premium Pill Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10 shadow-2xl">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'rounded-full transition-all duration-700',
                  index === currentSlide
                    ? 'w-10 h-2 bg-gradient-to-r from-accent-400 to-accent-500 shadow-lg shadow-accent-400/40'
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
