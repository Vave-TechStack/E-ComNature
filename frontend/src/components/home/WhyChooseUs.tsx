'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Reason {
  title: string;
  description: string;
  image: string;
  color: string;
}

const reasons: Reason[] = [
  {
    title: 'Forest Collection',
    description: 'Our products are sourced from the pristine forests of Araku Valley, Meghalaya, and the Western Ghats — where nature grows freely without human intervention.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    color: 'from-emerald-900/70 to-emerald-800/50',
  },
  {
    title: 'Chemical Free',
    description: 'No pesticides, no chemical fertilizers, no preservatives, no artificial colors. Just pure, natural food as nature intended.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    color: 'from-green-900/70 to-green-800/50',
  },
  {
    title: '100% Organic',
    description: 'Certified organic products from farms that have been practicing traditional, sustainable agriculture for generations.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    color: 'from-teal-900/70 to-teal-800/50',
  },
  {
    title: 'Direct From Farmers',
    description: 'We work directly with tribal cooperatives, organic farmer groups, and rural artisans — removing middlemen and ensuring fair prices.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
    color: 'from-amber-900/70 to-amber-800/50',
  },
  {
    title: 'Authenticity Guaranteed',
    description: 'Every product is verified for origin and quality. From GPS-tracked forest honey sources to lab-tested spice purity — we guarantee authenticity.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    color: 'from-orange-900/70 to-orange-800/50',
  },
  {
    title: 'Fair Trade Pledged',
    description: 'We ensure farmers receive fair compensation, prompt payments, and long-term partnerships that help build sustainable rural livelihoods.',
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&q=80',
    color: 'from-red-900/70 to-red-800/50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-1 w-6 rounded-full bg-primary-600" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Why NatureKart</span>
            <span className="h-1 w-6 rounded-full bg-primary-600" />
          </div>
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            We are more than a marketplace — we are a movement towards pure, authentic, and sustainable food.
          </p>
        </div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl h-72 md:h-80 cursor-default"
            >
              {/* Background Image */}
              <Image
                src={reason.image}
                alt={reason.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${reason.color} transition-opacity duration-500`} />
              
              {/* Extra hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-sm">
                  {reason.title}
                </h3>
                <p className="text-sm md:text-base text-white/80 leading-relaxed transition-all duration-500 max-w-md">
                  {reason.description}
                </p>
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
