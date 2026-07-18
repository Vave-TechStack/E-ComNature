'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Construction, Clock, RefreshCw, Mail, Leaf, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

function CountdownTimer({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Coming back now!'); return; }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-white">
      <Clock className="h-4 w-4 text-accent-300" />
      <span className="text-sm font-medium">Back in ~{timeLeft}</span>
    </div>
  );
}

export default function MaintenancePage() {
  const targetDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />

      <div className="container-custom py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          >
            <Wrench className="h-14 w-14 text-accent-400" />
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/20 border border-accent-500/30 px-4 py-1.5 text-xs font-semibold text-accent-300">
              <Construction className="h-3 w-3" /> Scheduled Maintenance
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-3xl sm:text-4xl font-bold text-white leading-tight"
          >
            We&apos;re making things&nbsp;
            <span className="text-accent-400">better</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-white/60 max-w-md mx-auto leading-relaxed"
          >
            We&apos;re currently performing scheduled maintenance to improve your shopping experience.
            We&apos;ll be back shortly with exciting new features!
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <CountdownTimer target={targetDate} />
          </motion.div>

          {/* Email notification */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="text-sm text-white/70">
              Want to know when we&apos;re back? Leave your email and we&apos;ll notify you.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-11 rounded-xl bg-white/10 border border-white/20 px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-400 transition-colors"
              />
              <Button className="gap-2 bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/25">
                <Mail className="h-4 w-4" /> Notify Me
              </Button>
            </div>
          </motion.div>

          {/* Refresh */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Refresh to check if we&apos;re back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
