'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { imageUrl: string; thumbnailUrl?: string; altText?: string; isPrimary: boolean }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 });
  const [mouseOnImage, setMouseOnImage] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : [{ imageUrl: '/images/placeholder.svg', isPrimary: false }];
  const currentImage = displayImages[selectedIndex];

  // Touch support
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  const openLightbox = useCallback(() => setIsLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === '+' || e.key === '=') setZoomLevel(z => Math.min(4, z + 0.5));
      if (e.key === '-') setZoomLevel(z => Math.max(1, z - 0.5));
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, nextImage, prevImage, closeLightbox]);

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
    <>
      <div className="space-y-4">
        {/* ===== MAIN IMAGE ===== */}
        <div
          ref={imageRef}
          className="relative aspect-square overflow-hidden rounded-[5px] bg-gradient-to-br from-noble-50 to-white border border-noble-200 select-none group"
          onMouseEnter={() => { setMouseOnImage(true); setIsZoomed(true); }}
          onMouseLeave={() => { setMouseOnImage(false); setIsZoomed(false); }}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="img"
          aria-label={`Image ${selectedIndex + 1} of ${displayImages.length}: ${currentImage.altText || productName}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative h-full w-full"
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.altText || productName}
                fill
                className="object-cover transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Premium zoom lens effect on desktop */}
          {isZoomed && mouseOnImage && typeof window !== 'undefined' && window.innerWidth >= 1024 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle 160px at ${lensPosition.x}% ${lensPosition.y}%, transparent 0%, rgba(16,185,129,0.08) 40%, rgba(16,185,129,0.03) 70%, transparent 100%)`,
              }}
            />
          )}

          {/* Image nav arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-noble-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 z-20"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-noble-700" />
              </button>
            </>
          )}

          {/* Top action bar */}
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); openLightbox(); }}
              className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="View fullscreen"
            >
              <Maximize2 className="h-4 w-4 text-noble-600" />
            </button>
          </div>

          {/* Zoom hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 z-20 hidden lg:flex items-center gap-1.5 rounded-xl bg-white/80 backdrop-blur-md px-3 py-1.5 text-xs text-noble-500 shadow-sm"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Hover to zoom</span>
          </motion.div>

          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Quick action overlay on image hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
        </div>

        {/* ===== THUMBNAILS STRIP ===== */}
        {displayImages.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={cn(
                'shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200',
                showThumbnails
                  ? 'border-primary-200 bg-primary-50 text-primary-600'
                  : 'border-noble-200 text-noble-400 hover:border-noble-300'
              )}
              aria-label="Toggle thumbnail view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {showThumbnails && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide"
                  role="tablist"
                  aria-label="Product image thumbnails"
                >
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      role="tab"
                      aria-selected={selectedIndex === index}
                      aria-label={`View image ${index + 1}: ${img.altText || productName}`}
                      className={cn(
                        'relative h-16 w-16 shrink-0 overflow-hidden rounded-[5px] border-2 transition-all duration-200',
                        selectedIndex === index
                          ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg shadow-primary-100'
                          : 'border-noble-200 hover:border-noble-400 hover:shadow-sm'
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
                      {/* Active indicator */}
                      {selectedIndex === index && (
                        <motion.div
                          layoutId="thumbnailActive"
                          className="absolute inset-0 ring-1 ring-inset ring-primary-500/30 rounded-[5px]"
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ===== LIGHTBOX OVERLAY ===== */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Fullscreen image viewer: ${productName}`}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
              aria-label="Close fullscreen view"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-3">
              <button
                onClick={() => setZoomLevel(z => Math.max(1, z - 0.5))}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-white/80 min-w-[3rem] text-center">
                {(zoomLevel * 50).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(5, z + 0.5))}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button
                onClick={() => setZoomLevel(2)}
                className="text-xs text-white/60 hover:text-white transition-colors font-medium"
              >
                Reset
              </button>
            </div>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white">
              {selectedIndex + 1} / {displayImages.length}
            </div>

            {/* Nav arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all opacity-70 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-7 w-7 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all opacity-70 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-7 w-7 text-white" />
                </button>
              </>
            )}

            {/* Image with zoom */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-[90vw] h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.altText || productName}
                fill
                className="object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
                sizes="90vw"
                priority
                draggable={false}
              />
            </motion.div>

            {/* Lightbox thumbnail strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goToImage(i); }}
                    className={cn(
                      'relative w-12 h-12 rounded-[5px] overflow-hidden border-2 transition-all',
                      i === selectedIndex
                        ? 'border-white ring-2 ring-white/30 scale-110'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image
                      src={img.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
