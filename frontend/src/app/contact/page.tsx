'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2,
  MessageCircle, ChevronRight, Leaf, Store, Camera, Globe,
  ArrowUpRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Our Address',
    value: '123, Eco Valley Road,\nWhitefield, Bangalore,\nKarnataka 560066, India',
    action: { label: 'Get Directions', href: 'https://maps.google.com/?q=Whitefield+Bangalore' },
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 1800-123-8900\n+91 98765 43210',
    action: { label: 'Call Now', href: 'tel:+9118001238900' },
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@naturekart.in\nsupport@naturekart.in',
    action: { label: 'Send Email', href: 'mailto:hello@naturekart.in' },
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 6:00 PM\n24/7 Online Support',
    action: { label: 'Live Chat', href: '/support/chat' },
  },
];

const faqPreviews = [
  { q: 'What is your return policy?', a: 'We offer a 10-day easy return policy on all products.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days across India.' },
  { q: 'Do you offer international shipping?', a: 'Yes, we ship to select international destinations.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) newErrors.email = 'Invalid email address';
    if (!formState.message.trim()) newErrors.message = 'Message is required';
    else if (formState.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-noble-50 via-white to-noble-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50/80 border border-primary-100/50 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Get In Touch</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-noble-900 leading-tight">
              We'd Love to{" "}
              <span className="bg-gradient-to-r from-primary-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>
            <p className="mt-4 text-lg text-noble-500 max-w-2xl mx-auto leading-relaxed">
              Have a question about our products, need help with an order, or just want to say hello?
              Our team is here to help you 24/7.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '24/7', label: 'Support Available', icon: MessageCircle },
              { value: '< 2hrs', label: 'Avg Response Time', icon: Clock },
              { value: '50K+', label: 'Happy Customers', icon: Leaf },
              { value: '99.5%', label: 'Satisfaction Rate', icon: CheckCircle },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-4 text-center shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-center mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-emerald-50 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-noble-800">{stat.value}</p>
                  <p className="text-xs text-noble-500 mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1 mb-2">
                <h2 className="text-lg font-bold text-noble-800">Contact Information</h2>
                <p className="text-sm text-noble-500">Reach out through any of these channels</p>
              </div>

              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className="group relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-md hover:border-noble-300/80 transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/50 via-emerald-400/50 to-primary-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-emerald-100 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-noble-400 uppercase tracking-wider mb-0.5">
                          {info.label}
                        </p>
                        <p className="text-sm font-medium text-noble-800 whitespace-pre-line leading-relaxed">
                          {info.value}
                        </p>
                        <Link
                          href={info.action.href}
                          className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors group/link"
                        >
                          {info.action.label}
                          <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-5 shadow-sm"
              >
                <p className="text-xs font-semibold text-noble-400 uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Camera, href: '#', label: 'Instagram' },
                    { icon: MessageCircle, href: '#', label: 'Facebook' },
                    { icon: Globe, href: '#', label: 'Twitter' },
                  ].map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-noble-100/80 text-noble-500 hover:bg-gradient-to-br hover:from-primary-500 hover:to-emerald-500 hover:text-white transition-all duration-200"
                        aria-label={social.label}
                      >
                        <SocialIcon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Form */}
              <div className="relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-6 md:p-8 shadow-sm">
                {/* Decorative blob */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-primary-100/30 to-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-emerald-100">
                      <Send className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-noble-800">Send Us a Message</h2>
                      <p className="text-xs text-noble-500">We typically respond within 2 hours</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4"
                        >
                          <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-noble-800">Message Sent Successfully!</h3>
                        <p className="text-sm text-noble-500 mt-1">Thank you for reaching out. We'll get back to you shortly.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-noble-700 mb-1.5">
                              Full Name <span className="text-red-400">*</span>
                            </label>
                            <Input
                              placeholder="Your name"
                              value={formState.name}
                              onChange={(e) => updateField('name', e.target.value)}
                              className={cn(
                                'h-11 rounded-xl border-noble-200/60 bg-white/70 backdrop-blur-sm text-sm placeholder:text-noble-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all',
                                errors.name && 'border-red-300 focus:border-red-400 focus:ring-red-100'
                              )}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-noble-700 mb-1.5">
                              Email Address <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={formState.email}
                              onChange={(e) => updateField('email', e.target.value)}
                              className={cn(
                                'h-11 rounded-xl border-noble-200/60 bg-white/70 backdrop-blur-sm text-sm placeholder:text-noble-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all',
                                errors.email && 'border-red-300 focus:border-red-400 focus:ring-red-100'
                              )}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-noble-700 mb-1.5">Phone Number</label>
                            <Input
                              placeholder="+91 98765 43210"
                              value={formState.phone}
                              onChange={(e) => updateField('phone', e.target.value)}
                              className="h-11 rounded-xl border-noble-200/60 bg-white/70 backdrop-blur-sm text-sm placeholder:text-noble-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-noble-700 mb-1.5">Subject</label>
                            <select
                              value={formState.subject}
                              onChange={(e) => updateField('subject', e.target.value)}
                              className="h-11 w-full rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                            >
                              <option value="">Select a subject</option>
                              <option value="order">Order Inquiry</option>
                              <option value="product">Product Question</option>
                              <option value="return">Return / Refund</option>
                              <option value="wholesale">Wholesale Inquiry</option>
                              <option value="partnership">Partnership</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-noble-700 mb-1.5">
                            Message <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            placeholder="Tell us how we can help you..."
                            value={formState.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            rows={5}
                            className={cn(
                              'w-full rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3.5 py-3 text-sm text-noble-800 placeholder:text-noble-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none',
                              errors.message && 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            )}
                          />
                          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-noble-400">
                            <span className="text-red-400">*</span> Required fields
                          </p>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200/50 transition-all hover:shadow-xl hover:shadow-primary-200/60 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl shadow-sm"
              >
                <div className="aspect-[21/9] min-h-[280px] bg-gradient-to-br from-noble-100 to-noble-50 relative">
                  {/* Google Maps Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1y292539!2d77.62335!3d12.97194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b8d521%3A0x9b8d5b8a5b8d5b8d!2sWhitefield%2C%20Bangalore%2C%20Karnataka%20560066!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', inset: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NatureKart Store Location"
                    className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-2 shadow-lg border border-white/50">
                      <Store className="h-4 w-4 text-primary-600" />
                      <span className="text-xs font-semibold text-noble-800">NatureKart HQ</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8"
          >
            <div className="rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-noble-800">Frequently Asked Questions</h2>
                  <p className="text-xs text-noble-500 mt-0.5">Quick answers to common questions</p>
                </div>
                <Link href="/faqs">
                  <Button variant="ghost" className="text-primary-600 gap-1 text-sm font-semibold">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {faqPreviews.map((faq) => (
                  <motion.div
                    key={faq.q}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-noble-200/40 bg-white/50 p-4 hover:shadow-sm hover:border-noble-300/60 transition-all"
                  >
                    <p className="text-sm font-semibold text-noble-800">{faq.q}</p>
                    <p className="text-xs text-noble-500 mt-1.5 leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
