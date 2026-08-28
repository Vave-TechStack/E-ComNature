'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-noble-500">
            <Link href="/" className="hover:text-primary-700">Home</Link><span className="text-noble-300">/</span>
            <span className="text-primary-600 font-medium">Terms & Conditions</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <Shield className="h-10 w-10 text-primary-600 mb-4" />
          <h1 className="text-3xl font-heading text-noble-900 mb-6">Terms & Conditions</h1>
          <div className="prose max-w-none space-y-6 text-noble-600 text-sm leading-relaxed">
            <p>Welcome to NatureKart. By using our website and services, you agree to these terms and conditions. Please read them carefully.</p>
            <h3 className="text-lg font-heading text-noble-900 mt-6">1. Account Registration</h3>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
            <h3 className="text-lg font-heading text-noble-900">2. Products & Pricing</h3>
            <p>All prices are in INR and include applicable taxes. We reserve the right to modify prices at any time. Product images are for illustration purposes; actual products may vary slightly.</p>
            <h3 className="text-lg font-heading text-noble-900">3. Orders & Payment</h3>
            <p>We accept payments via UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. Orders are confirmed only after payment verification.</p>
            <h3 className="text-lg font-heading text-noble-900">4. Shipping & Delivery</h3>
            <p>We ship across India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by external factors.</p>
            <h3 className="text-lg font-heading text-noble-900">5. Returns & Refunds</h3>
            <p>We offer a 10-day return policy for most products. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.</p>
            <h3 className="text-lg font-heading text-noble-900">6. Intellectual Property</h3>
            <p>All content on this website is the property of NatureKart and may not be reproduced without permission.</p>
            <h3 className="text-lg font-heading text-noble-900">7. Contact</h3>
            <p>For any questions regarding these terms, contact us at hello@naturekart.in or call +91 1800-123-8900.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
