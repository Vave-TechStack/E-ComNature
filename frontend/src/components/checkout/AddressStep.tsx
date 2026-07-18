'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Check, Home, Briefcase, Leaf, ChevronRight } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
          <MapPin className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Select Delivery Address</h2>
          <p className="text-sm text-gray-500">Where should we deliver your natural foods?</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockAddresses.map((addr) => (
          <motion.div
            key={addr.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelect(addr.id!)}
            className={cn(
              'relative cursor-pointer rounded-2xl border-2 p-5 transition-all',
              selectedAddressId === addr.id
                ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                : 'border-primary-100 hover:border-primary-300 bg-white hover:shadow-sm'
            )}
          >
            {selectedAddressId === addr.id && (
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 shadow-sm">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              {addr.addressType === 'home' ? (
                <Home className="h-4 w-4 text-primary-600" />
              ) : (
                <Briefcase className="h-4 w-4 text-primary-600" />
              )}
              <span className="text-xs font-bold uppercase text-primary-600 tracking-wider">{addr.label}</span>
              {addr.isDefault && (
                <span className="ml-auto rounded-full bg-primary-100 px-2.5 py-0.5 text-[9px] font-semibold text-primary-700">DEFAULT</span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
            <p className="text-sm text-gray-600 mt-0.5">{addr.addressLine1}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
            <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
          </motion.div>
        ))}

        {/* Add New Address */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all min-h-[200px]',
            showForm ? 'border-primary-400 bg-primary-50' : 'border-primary-200 hover:border-primary-400 hover:bg-primary-50'
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 mb-2">
            <Plus className="h-6 w-6 text-primary-500" />
          </div>
          <span className="text-sm font-semibold text-primary-600">Add New Address</span>
          <span className="text-xs text-gray-400 mt-0.5">Enter delivery details</span>
        </button>
      </div>

      {/* New Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-primary-100 bg-white"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-4 w-4 text-primary-600" />
                <h3 className="text-base font-bold text-gray-900">New Delivery Address</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <Input placeholder="Full Name" className="border-primary-200 focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                  <Input placeholder="Phone Number" className="border-primary-200 focus:border-primary-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1 *</label>
                  <Input placeholder="Street, Building, Apartment" className="border-primary-200 focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                  <Input placeholder="City" className="border-primary-200 focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                  <Input placeholder="Pincode" className="border-primary-200 focus:border-primary-400" />
                </div>
              </div>
              <Button className="gap-2 gradient-primary text-white font-semibold">
                <Check className="h-4 w-4" />
                Save Address
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-4 border-t border-primary-100">
        <Button onClick={onNext} disabled={!selectedAddressId} className="gap-2 gradient-primary text-white px-8 h-11 text-sm font-semibold shadow-lg shadow-primary-200 disabled:opacity-50">
          Continue to Shipping <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
