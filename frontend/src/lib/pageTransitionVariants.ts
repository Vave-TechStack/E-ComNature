import type { Variants } from 'framer-motion';

/**
 * Cinematic Page Transition Variants
 * Enterprise-grade, smooth 60fps transitions
 * Inspired by: Apple product pages, Stripe dashboard, linear.app
 */

export type TransitionMode =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'reveal'
  | 'morph'
  | 'none';

// Duration presets (seconds)
export const duration = {
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,
  cinematic: 0.8,
};

// Easing presets
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
};

// Page transition variants
export const pageVariants: Record<Exclude<TransitionMode, 'none'>, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: duration.normal, ease: ease.smooth } },
    exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.out } },
  },

  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1, y: 0,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0, y: -20,
      transition: { duration: duration.fast, ease: ease.inOut },
    },
  },

  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: {
      opacity: 1, y: 0,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0, y: 20,
      transition: { duration: duration.fast, ease: ease.inOut },
    },
  },

  slideLeft: {
    initial: { opacity: 0, x: 60 },
    animate: {
      opacity: 1, x: 0,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0, x: -30,
      transition: { duration: duration.fast, ease: ease.inOut },
    },
  },

  slideRight: {
    initial: { opacity: 0, x: -60 },
    animate: {
      opacity: 1, x: 0,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0, x: 30,
      transition: { duration: duration.fast, ease: ease.inOut },
    },
  },

  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: {
      opacity: 1, scale: 1,
      transition: { duration: duration.slow, ease: ease.out },
    },
    exit: {
      opacity: 0, scale: 0.95,
      transition: { duration: duration.fast, ease: ease.inOut },
    },
  },

  reveal: {
    initial: { clipPath: 'inset(0 0 100% 0)' },
    animate: {
      clipPath: 'inset(0 0 0 0)',
      transition: { duration: duration.cinematic, ease: ease.out },
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)',
      transition: { duration: duration.normal, ease: ease.inOut },
    },
  },

  morph: {
    initial: {
      opacity: 0,
      borderRadius: '3rem',
      scale: 0.96,
      filter: 'blur(8px)',
    },
    animate: {
      opacity: 1,
      borderRadius: '0rem',
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: duration.cinematic,
        ease: ease.out,
        borderRadius: { duration: 0.6, ease: ease.smooth },
      },
    },
    exit: {
      opacity: 0,
      borderRadius: '3rem',
      scale: 0.96,
      filter: 'blur(8px)',
      transition: {
        duration: duration.normal,
        ease: ease.inOut,
      },
    },
  },
};

// Transition config for motion.div
export function getPageTransitionProps(mode: TransitionMode = 'slideUp') {
  if (mode === 'none') {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  const variants = pageVariants[mode];
  return {
    variants,
    initial: 'initial' as const,
    animate: 'animate' as const,
    exit: 'exit' as const,
  };
}

// Overlay variants for gradient sweep effects
export const overlayVariants: Variants = {
  initial: {
    clipPath: 'inset(0 50% 0 50%)',
    transition: { duration: 0.4, ease: ease.out },
  },
  animate: {
    clipPath: 'inset(0 0 0 0)',
    transition: { duration: 0.6, ease: ease.out },
  },
  exit: {
    clipPath: 'inset(0 50% 0 50%)',
    transition: { duration: 0.4, ease: ease.inOut },
  },
};

// Route-based transition config
export interface RouteTransitionConfig {
  mode: TransitionMode;
  duration?: number;
}

// Default mode for all routes
export const defaultTransition: RouteTransitionConfig = {
  mode: 'slideUp',
};

// Route-specific overrides
export const routeTransitions: Record<string, RouteTransitionConfig> = {
  '/': { mode: 'morph' },
  '/products': { mode: 'slideLeft' },
  '/products/': { mode: 'slideLeft' },
  '/checkout': { mode: 'slideUp' },
  '/admin': { mode: 'fade' },
  '/admin/': { mode: 'fade' },
  '/profile': { mode: 'slideRight' },
  '/profile/': { mode: 'slideRight' },
  '/cart': { mode: 'slideLeft' },
  '/wishlist': { mode: 'scale' },
  '/about': { mode: 'reveal' },
  '/contact': { mode: 'reveal' },
  '/support': { mode: 'slideDown' },
  '/terms': { mode: 'fade' },
  '/returns': { mode: 'fade' },
  '/shipping': { mode: 'fade' },
  '/quality': { mode: 'fade' },
  '/wholesale': { mode: 'fade' },
  '/tracking': { mode: 'fade' },
  '/sitemap': { mode: 'fade' },
  '/faqs': { mode: 'slideUp' },
};

/**
 * Get the transition mode for a given pathname.
 * Matches exact routes and prefix routes (e.g., '/products/honey' matches '/products/')
 */
export function getTransitionModeForPath(pathname: string): TransitionMode {
  // Exact match first
  if (routeTransitions[pathname]) {
    return routeTransitions[pathname].mode;
  }

  // Prefix match (e.g., '/products/something' matches '/products/')
  for (const [route, config] of Object.entries(routeTransitions)) {
    if (route.endsWith('/') && pathname.startsWith(route)) {
      return config.mode;
    }
  }

  return defaultTransition.mode;
}
