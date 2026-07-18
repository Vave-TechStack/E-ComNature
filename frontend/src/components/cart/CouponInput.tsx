'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Percent, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponInputProps {
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  appliedCoupon?: string;
  discount?: number;
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
    } catch {
      setError('Invalid or expired coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  if (appliedCoupon) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">{appliedCoupon} Applied! 🎉</p>
              {discount && (
                <p className="text-xs text-green-600 font-medium">You saved {formatCouponDiscount(discount)} on this order</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between text-sm font-semibold text-gray-700">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary-500" />
          Have a coupon code?
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary-500 font-medium">Try SAVE50</span>
          <Percent className="h-4 w-4 text-gray-400" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex gap-2 pt-3">
              <Input placeholder="Enter coupon code" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                className="h-11 text-sm font-semibold uppercase border-primary-200 focus:border-primary-400"
                onKeyDown={(e) => e.key === 'Enter' && handleApply()} />
              <Button onClick={handleApply} disabled={!code.trim() || isApplying}
                className="h-11 shrink-0 px-6 gradient-primary text-white font-semibold shadow-sm">
                {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
              </Button>
            </div>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-red-500">{error}</motion.p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatCouponDiscount(discount: number): string {
  return discount >= 100 ? `₹${discount}` : `${discount}%`;
}
