'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Leaf, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-emerald-500/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[25rem] h-[25rem] rounded-full bg-accent-500/5 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        {/* Floating orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/[0.03]"
            style={{
              width: 60 + i * 40,
              height: 60 + i * 40,
              left: `${10 + i * 25}%`,
              top: `${15 + (i * 20) % 70}%`,
            }}
            animate={{
              y: [0, -20 - i * 8, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      <div className="container-luxury relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 mb-5 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Stay Connected</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            Get 10% Off Your First Order
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-emerald-100/60 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          >
            Subscribe to our newsletter and be the first to know about new products, seasonal offers, and natural wellness tips from our farming communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className={cn(
                'flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300',
                'bg-white/10 backdrop-blur-md border border-white/10',
                'focus-within:border-accent-400/50 focus-within:bg-white/15 focus-within:shadow-lg focus-within:shadow-accent-500/10'
              )}>
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Send className="h-4 w-4 text-white/40 shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-white/40 text-sm py-2.5"
                  />
                </div>
                <Button
                  type="submit"
                  className={cn(
                    'rounded-xl font-semibold text-sm h-10 px-5 transition-all duration-300',
                    isSubmitted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg shadow-accent-500/20'
                  )}
                >
                  {isSubmitted ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      Subscribed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Subscribe
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
            <p className="mt-3 text-xs text-white/30">
              No spam, ever. Unsubscribe anytime. We respect your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-6 text-white/30 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-300/50" />
              Weekly updates
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent-300/50" />
              Exclusive offers
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-300/50" />
              Farm stories
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
