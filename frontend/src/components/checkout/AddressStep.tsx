'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Check, Home, Briefcase, Leaf, ChevronRight, Building, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';

interface AddressStepProps {
  selectedAddressId?: number;
  onSelect: (id: number) => void;
  onNext: () => void;
}

const mockAddresses: Address[] = [
  {
    id: 1, label: 'Home', fullName: 'Rajesh Kumar', phone: '9876543210',
    addressLine1: '42, MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka',
    pincode: '560038', country: 'India', isDefault: true, addressType: 'home',
  },
  {
    id: 2, label: 'Office', fullName: 'Rajesh Kumar', phone: '9876543211',
    addressLine1: '91, Richmond Road, Ashok Nagar', city: 'Bangalore', state: 'Karnataka',
    pincode: '560025', country: 'India', isDefault: false, addressType: 'work',
  },
];

export function AddressStep({ selectedAddressId, onSelect, onNext }: AddressStepProps) {
  const [showForm, setShowForm] = useState(false);
  const selectedAddress = mockAddresses.find(a => a.id === selectedAddressId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <MapPin className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Select Delivery Address</h2>
          <p className="text-sm text-noble-400">Where should we deliver your natural foods?</p>
        </div>
      </div>

      {/* Address Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {mockAddresses.map((addr, index) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(addr.id!)}
            className={cn(
              'relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200',
              selectedAddressId === addr.id
                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100'
                : 'border-noble-200 bg-white hover:border-noble-300 hover:shadow-md'
            )}
          >
            {/* Check indicator */}
            {selectedAddressId === addr.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-emerald-500 shadow-sm"
              >
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </motion.div>
            )}

            {/* Address type tag */}
            <div className="flex items-center gap-2 mb-3">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg',
                addr.addressType === 'home' ? 'bg-amber-50' : 'bg-blue-50'
              )}>
                {addr.addressType === 'home' ? (
                  <Home className="h-4 w-4 text-amber-600" />
                ) : (
                  <Briefcase className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <span className="text-xs font-bold uppercase text-noble-500 tracking-wider">{addr.label}</span>
              {addr.isDefault && (
                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[9px] font-semibold text-primary-600 border border-primary-200/50">
                  DEFAULT
                </span>
              )}
            </div>

            {/* Address details */}
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-noble-800">{addr.fullName}</p>
              <p className="text-sm text-noble-500">{addr.addressLine1}</p>
              <p className="text-sm text-noble-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-noble-400 mt-1.5 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {addr.phone}
              </p>
            </div>

            {/* Hover gradient accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/0 via-transparent to-primary-50/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        ))}

        {/* Add New Address */}
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setShowForm(!showForm)}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all min-h-[220px]',
            showForm
              ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-white'
              : 'border-noble-200 hover:border-primary-400 hover:bg-primary-50/30'
          )}
        >
          <motion.div
            animate={showForm ? { rotate: 45 } : { rotate: 0 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 mb-2"
          >
            <Plus className="h-6 w-6 text-primary-500" />
          </motion.div>
          <span className="text-sm font-bold text-noble-700">Add New Address</span>
          <span className="text-xs text-noble-400 mt-0.5">Enter delivery details</span>
        </motion.button>
      </div>

      {/* New Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-noble-200 bg-white shadow-sm"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
                  <Building className="h-4 w-4 text-primary-600" />
                </div>
                <h3 className="text-base font-bold text-noble-800">New Delivery Address</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-noble-600 mb-1.5">Full Name *</label>
                  <Input
                    placeholder="Full Name"
                    className="border-noble-200 focus:border-primary-400 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-noble-600 mb-1.5">Phone *</label>
                  <Input
                    placeholder="Phone Number"
                    className="border-noble-200 focus:border-primary-400 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-noble-600 mb-1.5">Address Line 1 *</label>
                  <Input
                    placeholder="Street, Building, Apartment"
                    className="border-noble-200 focus:border-primary-400 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-noble-600 mb-1.5">City *</label>
                  <Input placeholder="City" className="border-noble-200 focus:border-primary-400 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-noble-600 mb-1.5">Pincode *</label>
                  <Input placeholder="Pincode" className="border-noble-200 focus:border-primary-400 rounded-xl" />
                </div>
              </div>

              <Button className="gap-2 gradient-primary text-white font-semibold shadow-lg shadow-primary-200/50 rounded-xl">
                <Check className="h-4 w-4" />
                Save Address
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <div className="flex justify-end pt-4 border-t border-noble-100">
        <Button
          onClick={onNext}
          disabled={!selectedAddressId}
          className="gap-2 gradient-primary text-white px-8 h-12 text-sm font-bold shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50 transition-all disabled:opacity-50 rounded-xl"
        >
          Continue to Shipping <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
