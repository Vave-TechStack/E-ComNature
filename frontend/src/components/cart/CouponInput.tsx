'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Percent, X, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponInputProps {
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  appliedCoupon?: string;
  discount?: number;
}

function formatCouponDiscount(discount: number): string {
  return discount >= 100 ? `₹${discount}` : `${discount}%`;
}

export function CouponInput({ onApply, onRemove, appliedCoupon, discount }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsApplying(true);
    setError('');
    try {
      await onApply(code.trim());
      setCode('');
      setIsOpen(false);
    } catch {
      setError('Invalid or expired coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm"
            >
              <CheckCircle className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-green-800">{appliedCoupon} Applied! 🎉</p>
              {discount && (
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  You saved {formatCouponDiscount(discount)} on this order
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-green-500 hover:text-green-700 hover:bg-green-100 transition-all"
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-noble-200 bg-white hover:border-noble-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium text-noble-700"
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary-500" />
          Have a coupon code?
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
            Try SAVE50
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Percent className="h-4 w-4 text-noble-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter coupon code"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                    className="h-11 text-sm font-semibold uppercase border-noble-200 focus:border-primary-400 rounded-xl pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  />
                  {code && !error && (
                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
                  )}
                </div>
                <Button
                  onClick={handleApply}
                  disabled={!code.trim() || isApplying}
                  className="h-11 shrink-0 px-6 gradient-primary text-white font-semibold shadow-sm rounded-xl"
                >
                  {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 font-medium flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> {error}
                </motion.p>
              )}
              <p className="text-[10px] text-noble-400">
                Apply coupon to get exclusive discounts on your order
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
