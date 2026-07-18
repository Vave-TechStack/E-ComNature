'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, ChevronRight } from 'lucide-react';

const sections = [
  { title: 'Shop', links: [
    { label: 'All Products', href: '/products' },
    { label: 'Natural Honey', href: '/products?category=honey' },
    { label: 'Millets & Grains', href: '/products?category=millets' },
    { label: 'Cold Pressed Oils', href: '/products?category=oils' },
    { label: 'Natural Spices', href: '/products?category=spices' },
    { label: 'A2 Ghee & Dairy', href: '/products?category=ghee' },
    { label: 'Pickles & Snacks', href: '/products?category=pickles' },
    { label: 'Herbal Tea', href: '/products?category=herbal' },
    { label: 'Dry Fruits & Nuts', href: '/products?category=dryfruits' },
    { label: 'Jaggery & Sweeteners', href: '/products?category=jaggery' },
    { label: 'Organic Collection', href: '/products?category=organic' },
  ]},
  { title: 'Account', links: [
    { label: 'My Profile', href: '/profile' },
    { label: 'My Orders', href: '/orders' },
    { label: 'My Wishlist', href: '/wishlist' },
    { label: 'My Addresses', href: '/profile/addresses' },
    { label: 'My Payments', href: '/profile/payments' },
    { label: 'Reward Points', href: '/profile/rewards' },
  ]},
  { title: 'Support', links: [
    { label: 'Help Center', href: '/support' },
    { label: 'Track Order', href: '/tracking' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact Us', href: '/support' },
  ]},
  { title: 'Company', links: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Farmers', href: '/farmers' },
    { label: 'Quality Promise', href: '/quality' },
    { label: 'Blog', href: '/blog' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ]},
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Sitemap</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <Leaf className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Sitemap</h1>
            <p className="text-gray-500 mt-2">Explore all pages on NatureKart</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-600 mb-4">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                        <ChevronRight className="h-3 w-3 text-primary-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
