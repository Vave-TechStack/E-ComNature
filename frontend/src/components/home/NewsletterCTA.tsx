'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-emerald-900 shadow-2xl shadow-primary-900/20"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-accent-500/5" />
            <div className="absolute left-1/3 bottom-1/4 h-24 w-24 rounded-full bg-white/5" />
            
            {/* Leaf pattern */}
            <div className="absolute right-10 top-10 opacity-5">
              <Leaf className="h-32 w-32 text-white" />
            </div>
            <div className="absolute left-16 bottom-10 opacity-5 rotate-45">
              <Sparkles className="h-24 w-24 text-accent-300" />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center px-6 py-12 md:py-16 lg:py-20">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Mail className="h-8 w-8 text-accent-400" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Stay Connected<br />
              <span className="text-accent-400">with Nature</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
              Get notified about new harvests, seasonal products, exclusive offers, 
              and healthy recipes delivered straight to your inbox.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-10 flex items-center justify-center gap-3 text-white"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">You&apos;re subscribed!</p>
                  <p className="text-sm text-white/60">Check your inbox for a welcome gift 🎁</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-13 border-0 bg-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-accent-400/50 text-base px-5 rounded-xl"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-13 gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 rounded-xl shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40 transition-all text-base"
                  >
                    <Send className="h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
                <p className="mt-4 text-xs text-white/30">
                  No spam. Just pure natural goodness. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            )}

            {/* Trust indicator */}
            <div className="mt-8 flex items-center justify-center gap-6 text-white/30 text-xs">
              <span>🌱 12,000+ Farmers</span>
              <span>🌟 50,000+ Happy Customers</span>
              <span>🔒 Secure & Private</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
