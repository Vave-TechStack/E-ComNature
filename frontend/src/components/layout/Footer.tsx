'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store, Heart, Leaf, MessageCircle, Camera, Play, Mail, MapPin, Phone, ArrowUpRight, Send } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Organic Collection', href: '/products?category=organic' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=bestsellers' },
      { label: "Today's Deals", href: '/products?sort=discount' },
      { label: 'Gift Boxes', href: '/products?category=gifts' },
    ],
  },
  categories: {
    title: 'Categories',
    links: [
      { label: 'Natural Honey', href: '/products?category=honey' },
      { label: 'Millets & Grains', href: '/products?category=millets' },
      { label: 'Cold Pressed Oils', href: '/products?category=oils' },
      { label: 'Natural Spices', href: '/products?category=spices' },
      { label: 'A2 Ghee & Dairy', href: '/products?category=ghee' },
      { label: 'Herbal & Wellness', href: '/products?category=herbal' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/support' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Track Order', href: '/tracking' },
      { label: 'Bulk Orders', href: '/wholesale' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Our Farmers', href: '/farmers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
};

export function Footer() {
  return (
    <footer className="website-footer bg-noble-900 text-white">
      {/* Top Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent" />

      {/* Main Footer */}
      <div className="container-luxury py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-heading text-white leading-none">{APP_NAME}</span>
                <span className="text-[10px] text-primary-400 uppercase tracking-[0.15em] leading-none mt-0.5">Pure & Natural</span>
              </div>
            </Link>
            <p className="text-sm text-noble-400 leading-relaxed mb-6 max-w-xs">
              Pure & natural foods sourced directly from farms, forests, and tribal communities across India. Every product tells a story of tradition and authenticity.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2.5 text-xs text-noble-400">
                <MapPin className="h-3.5 w-3.5 text-primary-500" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-noble-400">
                <Mail className="h-3.5 w-3.5 text-primary-500" />
                <a href="mailto:hello@naturekart.com" className="hover:text-primary-400 transition-colors">hello@naturekart.com</a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-noble-400">
                <Phone className="h-3.5 w-3.5 text-primary-500" />
                <a href="tel:+918000123456" className="hover:text-primary-400 transition-colors">+91 8000 123 456</a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Camera, href: '#', label: 'Instagram' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
                { icon: Play, href: '#', label: 'YouTube' },
                { icon: Send, href: '#', label: 'Telegram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 rounded-xl bg-white/5 hover:bg-primary-600/30 flex items-center justify-center transition-all hover:scale-110 border border-white/5 hover:border-primary-500/30"
                >
                  <social.icon className="h-4 w-4 text-noble-400 group-hover:text-primary-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-heading text-white mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-noble-400 hover:text-primary-400 transition-colors flex items-center gap-1 group/link"
                    >
                      {link.label}
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 -translate-y-0.5 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-5 text-xs text-noble-400">
            <span className="flex items-center gap-1.5">
              <Leaf className="h-3 w-3 text-primary-500" />
              100% Natural
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-primary-500" />
              Fair Trade
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3 w-3 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Secure Payments
            </span>
          </div>
          <p className="text-xs text-noble-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved. Made with 🌿 for nature.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
