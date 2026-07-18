'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

const ImpactStat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold gradient-text">{value}</div>
    <div className="text-xs md:text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

export function FarmerStory() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-1 w-6 rounded-full bg-accent-500" />
            <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest">Our Farmers</span>
            <span className="h-1 w-6 rounded-full bg-accent-500" />
          </div>
          <h2 className="section-title">Meet the People Behind Your Food</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
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
              transition={{ delay: index * 0.15 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-primary-100 shadow-lg shadow-primary-100/30 hover:shadow-2xl hover:shadow-primary-200/30 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 200px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 sm:hidden">
                    <Badge className="bg-accent-500 text-white border-0 text-xs">{farmer.badge}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 md:p-6">
                  <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs hidden sm:inline-flex mb-3">
                    {farmer.badge}
                  </Badge>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{farmer.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{farmer.name}</h3>
                  
                  <div className="relative">
                    <Quote className="h-6 w-6 text-primary-200 absolute -top-1 -left-1" />
                    <p className="text-sm text-gray-600 leading-relaxed pl-5">
                      {farmer.story}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-primary-600">
                      Known for: <span className="font-semibold">{farmer.product}</span>
                    </span>
                    <Heart className="h-4 w-4 text-red-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 p-8 md:p-12"
        >
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Our Impact Together</h3>
              <p className="text-white/60 mt-2 max-w-xl mx-auto">
                When you shop with us, you&apos;re directly supporting rural communities and sustainable farming
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <ImpactStat value="12,000+" label="Farmers Supported" />
              <ImpactStat value="500+" label="Villages Reached" />
              <ImpactStat value="50,000+" label="Happy Customers" />
              <ImpactStat value="100%" label="Chemical Free" />
            </div>

            <div className="mt-8 text-center">
              <Link href="/farmers">
                <Button className="bg-white text-primary-800 hover:bg-gray-100 font-semibold px-8 shadow-xl">
                  Know Our Farmers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
