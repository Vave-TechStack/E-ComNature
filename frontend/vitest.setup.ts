import '@testing-library/jest-dom/vitest';
import React from 'react';

// ===================== Next.js Mocks =====================

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, sizes, ...rest } = props;
    return React.createElement('img', {
      ...rest,
      style: fill ? { ...rest.style, objectFit: 'cover', width: '100%', height: '100%' } : rest.style,
    });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}));

// ===================== Framer Motion Mock =====================

const MotionDiv = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
  const { initial, animate, exit, variants, whileInView, viewport, transition, layout, custom, ...rest } = props;
  return React.createElement('div', { ...rest, ref });
});
MotionDiv.displayName = 'MotionComponent';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => MotionDiv,
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useMotionValue: (initial: number) => ({ get: () => initial, set: () => {} }),
  useTransform: (_value: unknown, _input: unknown, output: unknown) => output,
}));

// ===================== Browser API Mocks =====================

class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [0];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true, configurable: true, value: MockIntersectionObserver,
});

class MockResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true, configurable: true, value: MockResizeObserver,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true, configurable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
};
global.cancelAnimationFrame = (id: number) => { clearTimeout(id); };
