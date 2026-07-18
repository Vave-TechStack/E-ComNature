'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const jobs = [
  { title: 'Farm Relations Manager', location: 'Bangalore', type: 'Full-time', salary: '₹6-8 LPA', desc: 'Manage relationships with our network of organic farmers and tribal cooperatives across India.' },
  { title: 'Quality Assurance Lead', location: 'Bangalore', type: 'Full-time', salary: '₹5-7 LPA', desc: 'Oversee quality testing and certification of all natural food products in our supply chain.' },
  { title: 'E-commerce Manager', location: 'Remote', type: 'Full-time', salary: '₹4-6 LPA', desc: 'Drive our online sales strategy and optimize the customer shopping experience.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Careers</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Briefcase className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Join Our Team</h1>
            <p className="text-gray-500 mt-2">Help us make pure, natural food accessible to every Indian household</p>
          </div>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-white border border-primary-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{job.desc}</p>
                  </div>
                  <Button size="sm" className="gradient-primary text-white shrink-0">Apply Now</Button>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">No matching role? Email us at careers@naturekart.in</p>
        </motion.div>
      </div>
    </div>
  );
}
