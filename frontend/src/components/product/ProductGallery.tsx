'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { imageUrl: string; thumbnailUrl?: string; altText?: string; isPrimary: boolean }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [mouseOnImage, setMouseOnImage] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : [{ imageUrl: '/images/placeholder.svg', isPrimary: false }];
  const currentImage = displayImages[selectedIndex];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
    setMouseOnImage(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setMouseOnImage(false);
  }, []);

  const goToImage = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
    setIsZoomed(false);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    setIsZoomed(false);
  }, [displayImages.length]);

  // Touch support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevImage();
      else nextImage();
    }
    setTouchStart(null);
  }, [touchStart, prevImage, nextImage]);

  return (
    <div className="space-y-4">
      {/* Main Image Container with Magnifier */}
      <div
        ref={imageRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="img"
        aria-label={`Image ${selectedIndex + 1} of ${displayImages.length}: ${currentImage.altText || productName}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="relative h-full w-full"
          >
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.altText || productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Magnifier Lens - Desktop only */}
        {isZoomed && mouseOnImage && typeof window !== 'undefined' && window.innerWidth >= 1024 && (
          <>
            {/* Lens overlay on main image */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle 120px at ${lensPosition.x}% ${lensPosition.y}%, rgba(255,255,255,0.15) 0%, transparent 100%)`,
                border: '2px solid rgba(46, 125, 50, 0.3)',
              }}
            />
            {/* Separate zoomed view */}
            <div
              ref={zoomContainerRef}
              className="absolute top-0 left-[calc(100%+16px)] w-[500px] h-[500px] border-2 border-primary-200 rounded-xl bg-white shadow-2xl z-50 overflow-hidden hidden xl:block"
              style={{
                backgroundImage: `url(${currentImage.imageUrl})`,
                backgroundSize: '250%',
                backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
              role="img"
              aria-label={`Zoomed view of ${currentImage.altText || productName}`}
            />
          </>
        )}

        {/* Zoom hint */}
        {!isZoomed && displayImages.length > 0 && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[10px] text-gray-500 shadow-sm hidden lg:flex items-center gap-1.5">
            <Maximize2 className="h-3 w-3" />
            <span>Hover to zoom</span>
          </div>
        )}

        {/* Nav arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          className="absolute right-3 top-3 rounded-xl bg-white/90 p-2.5 shadow-sm backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
          aria-label="View fullscreen"
        >
          <Maximize2 className="h-4 w-4 text-gray-600" />
        </button>

        {/* Image counter badge */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Product image thumbnails">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`View image ${index + 1}: ${img.altText || productName}`}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
              )}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                draggable={false}
              />
              {!img.isPrimary && img.imageUrl !== displayImages[0]?.imageUrl && (
                <div className={cn(
                  'absolute inset-0 bg-white/50 transition-opacity duration-200',
                  selectedIndex === index ? 'opacity-0' : 'opacity-100'
                )} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
