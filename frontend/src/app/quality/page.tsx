'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Leaf, Award, FlaskConical, Users } from 'lucide-react';

const promises = [
  { icon: Shield, title: 'Authenticity Guaranteed', desc: 'Every product is verified for origin and quality. We trace each item back to its source.' },
  { icon: FlaskConical, title: 'Lab Tested', desc: 'Products are regularly tested for purity, contaminants, and nutritional value at certified labs.' },
  { icon: Leaf, title: '100% Natural', desc: 'No chemicals, preservatives, or artificial additives. Just pure, natural food.' },
  { icon: Award, title: 'Fair Trade Certified', desc: 'Farmers receive fair prices and we ensure ethical practices throughout our supply chain.' },
  { icon: Users, title: 'Direct from Producers', desc: 'No middlemen. We work directly with farmers and tribal cooperatives.' },
  { icon: CheckCircle, title: 'Satisfaction Guaranteed', desc: 'Not happy? We offer easy returns and replacements within 10 days.' },
];

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Quality Promise</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Shield className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Quality Promise</h1>
            <p className="text-gray-500 mt-3">We are committed to bringing you the purest, most authentic natural foods. Here&apos;s how we ensure every product meets our rigorous standards.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {promises.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-white border border-primary-100 hover:shadow-lg transition-shadow">
                  <Icon className="h-8 w-8 text-primary-600 mb-3" />
                  <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
