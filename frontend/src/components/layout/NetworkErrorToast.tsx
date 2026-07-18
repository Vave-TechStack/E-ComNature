'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, X, WifiOff, Shield, Clock } from 'lucide-react';

interface ErrorEvent {
  id: string;
  message: string;
  type: 'network' | 'timeout' | 'server' | 'auth';
  timestamp: number;
}

// Simple toast queue singleton
const errorListeners: Array<(error: ErrorEvent) => void> = [];
export function notifyNetworkError(message: string, type: ErrorEvent['type'] = 'network') {
  const error: ErrorEvent = {
    id: Math.random().toString(36).slice(2),
    message,
    type,
    timestamp: Date.now(),
  };
  errorListeners.forEach((fn) => fn(error));
}

export function NetworkErrorToast() {
  const pathname = usePathname();
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  const addError = useCallback((error: ErrorEvent) => {
    if (dismissedRef.current) return;
    setErrors((prev) => [...prev, error].slice(-3));
    setVisible(true);
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => {
      const next = prev.filter((e) => e.id !== id);
      if (next.length === 0) dismissedRef.current = true;
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setErrors([]);
    dismissedRef.current = true;
    setTimeout(() => setVisible(false), 300);
  }, []);

  const retryAll = useCallback(() => {
    dismissAll();
    setTimeout(() => window.location.reload(), 400);
  }, [dismissAll]);

  useEffect(() => {
    errorListeners.push(addError);
    return () => {
      const idx = errorListeners.indexOf(addError);
      if (idx >= 0) errorListeners.splice(idx, 1);
    };
  }, [addError]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (errors.length === 0) return;
    const timer = setTimeout(() => {
      setErrors([]);
      dismissedRef.current = true;
      setVisible(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [errors.length]);

  // Reset dismissed flag on route change
  useEffect(() => {
    dismissedRef.current = false;
    setVisible(false);
    setErrors([]);
  }, [pathname]);

  const getIcon = (type: ErrorEvent['type']) => {
    switch (type) {
      case 'network': return <WifiOff className="h-4 w-4 text-red-400" />;
      case 'timeout': return <Clock className="h-4 w-4 text-amber-400" />;
      case 'server': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'auth': return <Shield className="h-4 w-4 text-purple-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <AnimatePresence>
      {visible && errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm space-y-2"
          role="alert"
          aria-live="assertive"
        >
          <div className="rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {errors.length === 1 ? '1 Error' : `${errors.length} Errors`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={retryAll}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-gray-800 transition-colors"
                >
                  Retry All
                </button>
                <button
                  onClick={dismissAll}
                  className="rounded-full p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                  aria-label="Dismiss all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Error List */}
            <div className="divide-y divide-gray-700/20">
              {errors.map((error, idx) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 px-4 py-3 group"
                >
                  <div className="mt-0.5">{getIcon(error.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium leading-snug">
                      {error.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(error.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissError(error.id)}
                    className="rounded-full p-1 text-gray-600 hover:text-gray-300 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    aria-label="Dismiss error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer action */}
            <div className="px-4 py-2.5 bg-gray-800/30 flex items-center justify-between">
              <button
                onClick={retryAll}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Retry failed requests
              </button>
              <span className="text-[10px] text-gray-600">
                Auto-dismiss in 8s
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
