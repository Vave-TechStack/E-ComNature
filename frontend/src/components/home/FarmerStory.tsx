'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Quote, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const farmers = [
  {
    name: 'Lakshmi Devi',
    location: 'Araku Valley, Andhra Pradesh',
    story: 'Lakshmi and her cooperative of 200+ tribal women harvest wild forest honey using traditional methods passed down through generations. Each jar tells a story of the pristine Eastern Ghats.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    product: 'Forest Honey',
    badge: 'Tribal Women Cooperative',
  },
  {
    name: 'Raju Naik',
    location: 'Dindigul, Tamil Nadu',
    story: 'Raju converted his 5-acre family farm to organic millet cultivation 8 years ago. Today, he mentors 50+ farmers in the region, producing some of the finest foxtail and finger millets.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    product: 'Organic Millets',
    badge: 'Organic Farmer',
  },
];

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const hasPlus = value.includes('+');

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl md:text-4xl font-heading text-white"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {numericValue.toLocaleString()}
        </motion.span>
        {hasPlus && <span className="text-accent-400">+</span>}
      </motion.div>
      <div className="text-xs md:text-sm text-white/50 mt-1 font-medium">{value.replace(/[0-9,+]/g, '').trim()}</div>
    </div>
  );
}

export function FarmerStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={sectionRef} className="section-padding bg-white overflow-hidden relative">
      {/* Decorative background elements */}
      <motion.div style={{ y: bgY }} className="absolute -right-40 top-20 w-96 h-96 rounded-full bg-primary-100/20 blur-3xl pointer-events-none" />
      <motion.div style={{ y: -bgY }} className="absolute -left-40 bottom-20 w-80 h-80 rounded-full bg-accent-100/20 blur-3xl pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="divider-accent" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-[0.15em]">Our Farmers</span>
            <span className="divider-accent" />
          </motion.div>
          <h2 className="heading-md text-noble-900">Meet the People Behind Your Food</h2>
          <p className="mt-3 text-noble-400 max-w-2xl mx-auto text-sm md:text-base">
            Every product on NatureKart has a story — a story of hardworking farmers, tribal harvesters, and rural artisans who pour their heart into growing pure, natural food.
          </p>
        </div>

        {/* Farmer Profiles */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {farmers.map((farmer, index) => (
            <motion.div
              key={farmer.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-noble-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-52 h-56 sm:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 200px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:hidden">
                    <Badge className="bg-primary-600 text-white border-0 text-xs font-semibold shadow-sm">
                      {farmer.badge}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-7">
                  <Badge className="bg-primary-50 text-primary-700 border border-primary-200 text-xs hidden sm:inline-flex mb-3 font-semibold">
                    {farmer.badge}
                  </Badge>

                  <div className="flex items-center gap-1.5 text-xs text-noble-400 mb-2">
                    <MapPin className="h-3 w-3 text-primary-500" />
                    <span>{farmer.location}</span>
                  </div>

                  <h3 className="text-lg font-heading text-noble-900 mb-3">{farmer.name}</h3>

                  <div className="relative">
                    <Quote className="h-6 w-6 text-primary-100 absolute -top-1 -left-1 opacity-60" />
                    <p className="text-sm text-noble-500 leading-relaxed pl-5">
                      {farmer.story}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-noble-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-primary-600">
                      Known for: <span className="font-semibold">{farmer.product}</span>
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Heart className="h-4 w-4 text-noble-300 hover:text-red-400 transition-colors" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-noble-800 via-noble-900 to-noble-900 p-8 md:p-12 shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-700/5" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-700/5" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-heading text-white">Our Impact Together</h3>
              <p className="text-white/40 mt-2 max-w-xl mx-auto text-sm">
                When you shop with us, you&apos;re directly supporting rural communities and sustainable farming
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <AnimatedCounter value="12,000+ Happy Customers" />
              <AnimatedCounter value="500+ Farmers Supported" />
              <AnimatedCounter value="50,000+ Products Sold" />
              <AnimatedCounter value="100% Chemical Free" />
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <Link href="/farmers">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-white text-noble-900 hover:bg-noble-50 font-semibold px-8 h-11 rounded-xl shadow-lg gap-2">
                    Know Our Farmers
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
