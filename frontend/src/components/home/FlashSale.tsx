'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTargetDate(): Date {
  const target = new Date();
  target.setHours(target.getHours() + 12);
  target.setMinutes(target.getMinutes() + 45);
  return target;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const difference = target.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(difference / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-b from-white to-emerald-50 shadow-lg shadow-emerald-900/10 border border-white/50"
            style={{ transformStyle: 'preserve-3d', perspective: '200px' }}
          >
            <span className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
}

export function FlashSale() {
  const [targetDate] = useState(getTargetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  const updateTimer = useCallback(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section className="section-padding">
      <div className="container-luxury">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 shadow-2xl shadow-emerald-900/20">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[25px] border-emerald-500/10" />
            <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full border-[35px] border-emerald-400/8" />
            <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full border-[12px] border-accent-400/10" />
            <motion.div
              className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent-500/5 blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 mb-4 border border-white/10"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-300" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Limited Time Offer
                </span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {isExpired ? 'Sale Ended!' : "Today's Natural Deals"}
              </h2>
              <p className="mt-3 text-emerald-100/70 max-w-md text-sm sm:text-base leading-relaxed">
                Exclusive discounts on pure honey, organic millets, cold-pressed oils, and more. Nature&apos;s best, at unbeatable prices!
              </p>

              <div className="mt-6 flex items-center gap-4">
                {!isExpired && (
                  <div className="flex items-center gap-2 text-emerald-200/60">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Ends in</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Timer + CTA */}
            <div className="flex flex-col items-center gap-5 lg:items-end">
              {isExpired ? (
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 h-12 rounded-xl shadow-2xl">
                  New Deals Coming Soon
                </Button>
              ) : (
                <>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <FlipUnit value={timeLeft.hours} label="Hours" />
                    <span className="text-2xl font-bold text-emerald-200/50 mt-3">:</span>
                    <FlipUnit value={timeLeft.minutes} label="Minutes" />
                    <span className="text-2xl font-bold text-emerald-200/50 mt-3">:</span>
                    <FlipUnit value={timeLeft.seconds} label="Seconds" />
                  </div>
                  <Link href="/products?sort=discount">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold px-8 h-12 rounded-xl shadow-2xl shadow-accent-500/30 gap-2 text-base"
                      >
                        Grab the Deals
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
