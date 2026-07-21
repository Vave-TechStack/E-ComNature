'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  getTransitionModeForPath,
  getPageTransitionProps,
  duration,
  ease,
} from '@/lib/pageTransitionVariants';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Decorative overlay that sweeps across the screen during page transitions
// ---------------------------------------------------------------------------
function TransitionOverlay({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60] flex"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      aria-hidden
    >
      {/* Gradient sweep from left */}
      <motion.div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-primary-600/10 via-primary-400/5 to-transparent'
        )}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '200%' }}
        transition={{
          duration: 0.8,
          ease: ease.out,
        }}
      />
      {/* Subtle sheen */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Loading bar that appears during route transitions
// ---------------------------------------------------------------------------
function RouteLoadingBar() {
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-0.5"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: ease.out }}
      style={{ transformOrigin: '0% 50%' }}
      aria-hidden
    >
      <div className="h-full w-full bg-gradient-to-r from-primary-500 via-emerald-400 to-accent-500" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Entrance text reveal effect (for hero sections)
// ---------------------------------------------------------------------------
function EntranceReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: ease.out,
          delay: 0.15,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main PageTransition component
// ---------------------------------------------------------------------------
interface PageTransitionProps {
  children: React.ReactNode;
  /** Override transition mode for specific pages via a wrapper */
  mode?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'reveal' | 'morph' | 'none';
  /** Show decorative gradient sweep overlay */
  showOverlay?: boolean;
  /** Show top loading bar during transitions */
  showLoadingBar?: boolean;
  /** Show entrance reveal animation for first load */
  showEntranceReveal?: boolean;
}

export function PageTransition({
  children,
  mode: explicitMode,
  showOverlay = true,
  showLoadingBar = true,
  showEntranceReveal = false,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);

  // Detect route changes
  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
      return;
    }
    if (prevPathRef.current !== pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      prevPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, isFirstMount]);

  // Determine transition mode — explicit prop > route-based
  const mode = explicitMode || getTransitionModeForPath(pathname);
  const transitionProps = getPageTransitionProps(mode);

  // For the first mount, no exit animation needed
  const initial = isFirstMount ? { opacity: 1 } : transitionProps.initial;

  return (
    <>
      {/* Loading bar with own AnimatePresence for smooth exit */}
      <AnimatePresence>
        {showLoadingBar && isTransitioning && <RouteLoadingBar />}
      </AnimatePresence>

      {/* Gradient sweep overlay with own AnimatePresence */}
      <AnimatePresence>
        {showOverlay && isTransitioning && <TransitionOverlay />}
      </AnimatePresence>

      {/* Animated page content — direct child of AnimatePresence for exit animations to work */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={initial}
          animate={transitionProps.animate}
          exit={transitionProps.exit}
          variants={transitionProps.variants}
          className="min-h-full"
        >
          {showEntranceReveal ? (
            <EntranceReveal>{children}</EntranceReveal>
          ) : (
            children
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Scoped page transition — wraps a section with an entrance animation
// Useful for animating specific sections on scroll, not just route changes.
// ---------------------------------------------------------------------------
interface ScopedTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  mode?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'reveal' | 'morph';
}

export function ScopedTransition({
  children,
  className,
  delay = 0,
  mode = 'slideUp',
}: ScopedTransitionProps) {
  const transitionProps = getPageTransitionProps(mode);

  return (
    <motion.div
      initial={transitionProps.initial}
      whileInView={transitionProps.animate}
      viewport={{ once: true, margin: '-50px' }}
      variants={transitionProps.variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Staggered children animation — for lists/grids of items
// ---------------------------------------------------------------------------
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.04,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item — child of StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: ease.out },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
