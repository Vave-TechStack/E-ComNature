'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <Shield className="h-10 w-10 text-primary-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
            <p>At NatureKart, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            <h3 className="text-lg font-semibold text-gray-900 mt-6">Information We Collect</h3>
            <p>We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email, phone number, shipping address, and payment information.</p>
            <h3 className="text-lg font-semibold text-gray-900">How We Use Your Information</h3>
            <p>We use your information to process orders, deliver products, provide customer support, send order updates, and improve our services. We do not sell your personal data to third parties.</p>
            <h3 className="text-lg font-semibold text-gray-900">Data Security</h3>
            <p>We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your data.</p>
            <h3 className="text-lg font-semibold text-gray-900">Cookies</h3>
            <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings in your browser.</p>
            <h3 className="text-lg font-semibold text-gray-900">Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at hello@naturekart.in for any privacy-related requests.</p>
            <h3 className="text-lg font-semibold text-gray-900">Updates</h3>
            <p>We may update this policy periodically. Changes will be posted on this page with the updated date.</p>
            <p className="mt-6 text-xs text-gray-400">Last updated: March 2026</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
