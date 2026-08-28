import type { Metadata, Viewport } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Providers from './providers';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { PageTransition } from '@/components/layout/PageTransition';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { NetworkErrorToast } from '@/components/layout/NetworkErrorToast';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { cn } from "@/lib/utils";

const geist = Inter({ subsets: ['latin'], variable: '--font-sans' });

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Pure & Natural Foods`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'natural foods', 'organic', 'healthy eating', 'tribal honey', 'forest honey',
    'millets', 'cold pressed oils', 'A2 ghee', 'natural spices', 'herbal products',
    'chemical-free food', 'traditional rice', 'natural foods online', 'NatureKart',
    'organic shopping', 'ayurvedic', 'wellness', 'pure foods', 'farm fresh',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1F1C17' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable, dmSerif.variable)}>
      <body suppressHydrationWarning className={`${geist.variable} font-sans antialiased`}>
        <Providers>
          <TooltipProvider>
            <ScrollToTop />
            <OfflineBanner />
            <NetworkErrorToast />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-16 lg:pb-0">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </div>
            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* MobileNav rendered at root level — wrapped in Suspense for useSearchParams */}
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
