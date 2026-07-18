'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for push subscription
        registration.pushManager.getSubscription().then((subscription) => {
          if (!subscription) {
            console.log('[PWA] Not subscribed to push notifications');
          }
        });
      }).catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Show install prompt after a delay
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    const result = await (installPrompt as any).userChoice;
    if (result.outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  }, [installPrompt]);

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="rounded-2xl bg-white border border-primary-100 shadow-2xl shadow-primary-200/20 p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Install NatureKart</p>
              <p className="text-xs text-gray-500">Get app-like experience with offline access</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                onClick={handleInstall}
                className="gradient-primary text-white text-xs h-8 px-3 font-semibold shadow-sm"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Install
              </Button>
              <button
                onClick={() => setShowPrompt(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
