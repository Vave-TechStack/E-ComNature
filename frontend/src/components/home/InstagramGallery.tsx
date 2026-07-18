'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryItem {
  id: number;
  image: string;
  likes: string;
  comments: string;
  caption: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80',
    likes: '2.4k',
    comments: '89',
    caption: 'Fresh harvest from organic farms! 🌾',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80',
    likes: '1.8k',
    comments: '56',
    caption: 'Morning ritual with herbal tea 🍵',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80',
    likes: '3.1k',
    comments: '124',
    caption: 'Pure forest honey tasting session 🍯',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80',
    likes: '2.7k',
    comments: '92',
    caption: 'From our farm to your table 🌿',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80',
    likes: '4.2k',
    comments: '156',
    caption: 'Rainbow of fresh organic vegetables 🥗',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80',
    likes: '1.5k',
    comments: '43',
    caption: 'Dry fruits - nature\'s superfoods 🥜',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    likes: '2.9k',
    comments: '108',
    caption: 'Spices that tell a story 🌶️',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1625937286692-6b85a3a53f0d?w=400&q=80',
    likes: '1.2k',
    comments: '34',
    caption: 'Homemade pickles - taste of tradition 🥒',
  },
];

export function InstagramGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % galleryItems.length : null);
  const goPrev = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            <span className="text-xs font-semibold text-pink-500 uppercase tracking-widest">Follow Us</span>
          </div>
          <h2 className="section-title">@naturekart on Instagram</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Tag us in your photos using <span className="font-semibold text-primary-600">#NatureKartLife</span> for a chance to be featured!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-primary-50 cursor-pointer"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart className="h-4 w-4 fill-white" />
                      <span className="text-xs font-semibold">{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <MessageCircle className="h-4 w-4 fill-white" />
                      <span className="text-xs font-semibold">{item.comments}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/80 px-4 text-center line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>

              {/* Instagram Icon */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="h-4 w-4 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition-all"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-[70vh] w-[80vw] max-w-2xl">
                  <Image
                    src={galleryItems[lightboxIndex].image}
                    alt={galleryItems[lightboxIndex].caption}
                    fill
                    className="object-contain rounded-2xl"
                    sizes="80vw"
                    priority
                  />
                </div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-white">
                    <Heart className="h-3.5 w-3.5 fill-white" />
                    <span className="text-xs font-semibold">{galleryItems[lightboxIndex].likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <MessageCircle className="h-3.5 w-3.5 fill-white" />
                    <span className="text-xs font-semibold">{galleryItems[lightboxIndex].comments}</span>
                  </div>
                  <span className="text-[10px] text-white/50 ml-2">
                    {lightboxIndex + 1} / {galleryItems.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="https://instagram.com/naturekart"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:opacity-90 font-semibold px-8 shadow-xl shadow-pink-500/20">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Follow @naturekart
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
