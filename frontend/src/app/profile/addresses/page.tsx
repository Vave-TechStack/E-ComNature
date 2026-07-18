'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Check, X, Navigation, Loader2, Crosshair, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ===== Geolocation Component =====
function GeoLocationDetect({ onLocationFound }: { onLocationFound: (coords: { lat: number; lng: number }) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setIsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationFound({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        setError(err.code === 1 ? 'Location access denied. Please enable location services.' : 'Unable to detect location. Please enter manually.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [onLocationFound]);

  return (
    <div className="rounded-xl border border-dashed border-primary-200 bg-primary-50/30 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 shrink-0">
          <Crosshair className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Use Current Location</p>
          <p className="text-xs text-gray-500">Detect your current location and pre-fill address fields</p>
          {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 shrink-0 border-primary-200 text-primary-700 hover:bg-primary-100"
          onClick={detectLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Detecting...</>
          ) : (
            <><Navigation className="h-4 w-4" /> Detect Location</>
          )}
        </Button>
      </div>
    </div>
  );
}

interface Address {
  id: number; label: string; fullName: string; phone: string;
  addressLine1: string; addressLine2?: string; city: string;
  state: string; pincode: string; isDefault: boolean; addressType: string;
}

const initialAddresses: Address[] = [
  { id: 1, label: 'Home', fullName: 'Rajesh Kumar', phone: '+91 9876543210', addressLine1: '42, MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', isDefault: true, addressType: 'home' },
  { id: 2, label: 'Office', fullName: 'Rajesh Kumar', phone: '+91 9876543211', addressLine1: '91, Richmond Road, Ashok Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560025', isDefault: false, addressType: 'work' },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ label: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });

  const resetForm = () => setForm({ label: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(a => a.id === editingId ? { ...a, ...form } : a));
    } else {
      setAddresses([...addresses, { id: Date.now(), ...form, addressType: 'other', isDefault: addresses.length === 0 }]);
    }
    resetForm();
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (addr: Address) => {
    setForm({ ...addr, addressLine2: addr.addressLine2 ?? '' });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const setDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Addresses</h2>
        <Button size="sm" className="gap-2 gradient-primary" onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}><Plus className="h-4 w-4" /> Add Address</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="relative rounded-xl border-2 border-gray-200 bg-white p-4">
            {addr.isDefault && <Badge className="absolute right-3 top-3 bg-green-100 text-green-700 border-0">Default</Badge>}
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary-600 mt-0.5" />
              <span className="text-xs font-semibold uppercase text-primary-600">{addr.label}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{addr.fullName}</p>
            <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
            <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              {!addr.isDefault && <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDefault(addr.id)}>Set as Default</Button>}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(addr)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(addr.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Geolocation - Use Current Location */}
      <GeoLocationDetect onLocationFound={(coords) => {
        setForm(prev => ({ ...prev, addressLine1: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` }));
        setShowForm(true);
        setEditingId(null);
      }} />

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">{editingId ? 'Edit Address' : 'New Address'}</h3>
              <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingId(null); }}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Label</label><select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500"><option value="">Select</option><option>Home</option><option>Office</option><option>Other</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label><Input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label><Input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required /></div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                <Button type="submit" className="gradient-primary">Save Address</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
