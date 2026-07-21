'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Shield, Sparkles, Users, MapPin, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const reasons = [
  {
    title: 'Forest Collection',
    description: 'Sourced from pristine forests of Araku Valley, Meghalaya, and the Western Ghats — where nature grows freely without human intervention.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    icon: MapPin,
    gradient: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
    color: 'text-emerald-400',
  },
  {
    title: 'Chemical Free',
    description: 'No pesticides, no chemical fertilizers, no preservatives, no artificial colors. Just pure, natural food as nature intended.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    icon: Leaf,
    gradient: 'from-green-900/80 via-green-800/50 to-transparent',
    color: 'text-green-400',
  },
  {
    title: '100% Organic',
    description: 'Certified organic products from farms practicing traditional, sustainable agriculture for generations.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    icon: Sparkles,
    gradient: 'from-teal-900/80 via-teal-800/50 to-transparent',
    color: 'text-teal-400',
  },
  {
    title: 'Direct From Farmers',
    description: 'We work directly with tribal cooperatives, organic farmer groups, and rural artisans — removing middlemen and ensuring fair prices.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
    icon: Users,
    gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
    color: 'text-amber-400',
  },
  {
    title: 'Authenticity Guaranteed',
    description: 'Every product is verified for origin and quality. From GPS-tracked forest honey sources to lab-tested spice purity — we guarantee authenticity.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    icon: Shield,
    gradient: 'from-orange-900/80 via-orange-800/50 to-transparent',
    color: 'text-orange-400',
  },
  {
    title: 'Fair Trade Pledged',
    description: 'We ensure farmers receive fair compensation, prompt payments, and long-term partnerships that help build sustainable rural livelihoods.',
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&q=80',
    icon: HeartHandshake,
    gradient: 'from-red-900/80 via-red-800/50 to-transparent',
    color: 'text-red-400',
  },
];

function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.8]);
  const Icon = reason.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[5px] h-80 md:h-96 cursor-default bg-noble-900"
    >
      {/* Parallax Background */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <Image
          src={reason.image}
          alt={reason.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div style={{ opacity: overlayOpacity }} className={cn('absolute inset-0 bg-gradient-to-t', reason.gradient)} />

      {/* Extra hover overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/10">
            <Icon className={cn('h-5 w-5', reason.color)} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">{reason.title}</h3>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.05 }}
          className="text-sm md:text-base text-white/70 leading-relaxed max-w-md"
        >
          {reason.description}
        </motion.p>
      </div>

      {/* Top accent line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent',
        'transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700'
      )} />
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-noble-900 overflow-hidden">
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
            <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.15em]">Why NatureKart</span>
            <span className="divider-accent" />
          </motion.div>
          <h2 className="heading-md text-noble-800 dark:text-noble-100">Why Choose Us?</h2>
          <p className="mt-3 text-noble-400 max-w-2xl mx-auto text-sm md:text-base">
            We are more than a marketplace — we are a movement towards pure, authentic, and sustainable food.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
