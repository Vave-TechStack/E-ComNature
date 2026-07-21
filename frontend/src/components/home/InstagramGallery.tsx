'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ArrowRight, X, ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: number;
  image: string;
  likes: string;
  comments: string;
  caption: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80', likes: '2.4k', comments: '89', caption: 'Fresh harvest from organic farms! 🌾' },
  { id: 2, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80', likes: '1.8k', comments: '56', caption: 'Morning ritual with herbal tea 🍵' },
  { id: 3, image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80', likes: '3.1k', comments: '124', caption: 'Pure forest honey tasting session 🍯' },
  { id: 4, image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80', likes: '2.7k', comments: '92', caption: 'From our farm to your table 🌿' },
  { id: 5, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80', likes: '4.2k', comments: '156', caption: 'Rainbow of fresh organic vegetables 🥗' },
  { id: 6, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', likes: '1.5k', comments: '43', caption: 'Dry fruits - nature\'s superfoods 🥜' },
  { id: 7, image: 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=400&q=80', likes: '2.9k', comments: '108', caption: 'Spices that tell a story 🌶️' },
  { id: 8, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', likes: '1.2k', comments: '34', caption: 'Homemade pickles - taste of tradition 🥒' },
];

export function InstagramGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % galleryItems.length : null);
  const goPrev = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null);

  return (
    <section className="section-padding bg-noble-50 dark:bg-noble-900 overflow-hidden">
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
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-[0.15em]">Follow Us</span>
            <span className="divider-accent" />
          </motion.div>
          <h2 className="heading-md text-noble-800 dark:text-noble-100">@naturekart on Instagram</h2>
          <p className="mt-3 text-noble-400 max-w-2xl mx-auto text-sm">
            Tag us in your photos using{' '}
            <span className="font-semibold text-primary-500">#NatureKartLife</span> for a chance to be featured!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-[5px] bg-noble-100 dark:bg-noble-800 cursor-pointer"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />

              {/* Glass Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="flex items-center gap-5 mb-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart className="h-4 w-4 fill-white" />
                      <span className="text-xs font-bold">{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <MessageCircle className="h-4 w-4 fill-white" />
                      <span className="text-xs font-bold">{item.comments}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/80 text-center line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>

              {/* Top-right icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="h-4 w-4 text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 z-10 rounded-2xl glass-dark p-3 text-white hover:bg-white/20 transition-all"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-6 z-10 rounded-2xl glass-dark p-3 text-white hover:bg-white/20 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-6 z-10 rounded-2xl glass-dark p-3 text-white hover:bg-white/20 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-[70vh] w-[80vw] max-w-2xl">
                  <Image
                    src={galleryItems[lightboxIndex].image}
                    alt={galleryItems[lightboxIndex].caption}
                    fill
                    className="object-contain rounded-[5px]"
                    sizes="80vw"
                    priority
                  />
                </div>

                {/* Glass info bar */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 glass-dark rounded-2xl px-5 py-2.5 flex items-center gap-4 border border-white/10">
                  <div className="flex items-center gap-1.5 text-white">
                    <Heart className="h-3.5 w-3.5 fill-white" />
                    <span className="text-xs font-semibold">{galleryItems[lightboxIndex].likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <MessageCircle className="h-3.5 w-3.5 fill-white" />
                    <span className="text-xs font-semibold">{galleryItems[lightboxIndex].comments}</span>
                  </div>
                  <span className="text-[10px] text-white/50 ml-1 border-l border-white/10 pl-3">
                    {lightboxIndex + 1} / {galleryItems.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="https://instagram.com/naturekart" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:opacity-90 font-semibold px-8 h-11 rounded-xl shadow-2xl shadow-pink-500/20 gap-2">
              <Camera className="h-4 w-4" />
              Follow @naturekart
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
