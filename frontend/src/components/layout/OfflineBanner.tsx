'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, X } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showDismissed, setShowDismissed] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Offline Banner */}
      {!isOnline && !showDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white text-sm flex-1 min-w-0">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <WifiOff className="h-4 w-4 shrink-0" />
              </motion.div>
              <span className="font-medium">You&apos;re offline</span>
              <span className="text-white/70 text-xs hidden sm:inline truncate">
                Some features may be unavailable. Check your internet connection.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
              <button
                onClick={() => setShowDismissed(true)}
                className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Online Toast */}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5 flex items-center justify-center gap-2"
        >
          <Wifi className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">Back online! You&apos;re connected again.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
