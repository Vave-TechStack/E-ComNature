'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const pathname = usePathname();
  const isPopState = useRef(false);

  // Track browser back/forward navigation via popstate event
  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top only on forward navigation (Link clicks, router.push)
  // Skip scrolling on browser back/forward buttons — let Next.js restore position
  useEffect(() => {
    if (isPopState.current) {
      // This is a back/forward navigation — reset the flag and let browser restore scroll
      isPopState.current = false;
      return;
    }
    // This is forward navigation — scroll to top smoothly
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
