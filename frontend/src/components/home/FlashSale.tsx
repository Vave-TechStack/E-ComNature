'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTargetDate(): Date {
  const target = new Date();
  target.setHours(target.getHours() + 24);
  return target;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const difference = target.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-white shadow-lg"
      >
        <span className="text-xl sm:text-2xl font-bold text-gray-900">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="mt-1 text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
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

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && 
                    timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 p-8 sm:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[20px] border-white" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[30px] border-white" />
            <div className="absolute right-1/4 top-1/4 h-32 w-32 rounded-full border-[10px] border-white" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-semibold text-yellow-300 uppercase tracking-wider">
                  Flash Sale
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {isExpired ? 'Sale Ended!' : 'Today\'s Natural Deals'}
              </h2>
              <p className="mt-2 text-white/80 max-w-md">
                Exclusive discounts on pure honey, organic millets, cold-pressed oils, and more. Nature&apos;s best, at unbeatable prices!
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:items-end">
              {!isExpired && (
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Ends in</span>
                </div>
              )}
              
              {isExpired ? (
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-8">
                  New Deals Coming Soon
                </Button>
              ) : (
                <>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <TimeBlock value={timeLeft.hours} label="Hours" />
                    <span className="text-2xl font-bold text-white/60 mb-6">:</span>
                    <TimeBlock value={timeLeft.minutes} label="Minutes" />
                    <span className="text-2xl font-bold text-white/60 mb-6">:</span>
                    <TimeBlock value={timeLeft.seconds} label="Seconds" />
                  </div>
                  <Link href="/products?sort=discount">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-8 shadow-xl">
                      Grab the Deals
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute right-1/4 top-1/2 hidden lg:block">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'absolute rounded-full bg-white/20 backdrop-blur-sm border border-white/10',
                  i === 1 && 'h-16 w-16 -top-8 right-0',
                  i === 2 && 'h-12 w-12 top-4 right-20',
                  i === 3 && 'h-20 w-20 -top-12 right-32'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
