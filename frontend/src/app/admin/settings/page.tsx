'use client';

import { useState } from 'react';
import { Save, Store, Mail, Shield, CreditCard, Bell, Globe, Palette, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const settingsSections = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'seo', label: 'SEO', icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your store configuration</p>
        </div>
        <Button className="gap-2 gradient-primary"><Save className="h-4 w-4" /> Save Changes</Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-48 shrink-0 space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <Input defaultValue="NatureKart" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                  <Input defaultValue="admin@naturekart.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <Input defaultValue="Pure & Natural Foods from Farm to Home" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'email' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
              <Separator />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                  <Input defaultValue="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                    <Input defaultValue="587" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                    <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                  <Input defaultValue="noreply@naturekart.com" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">Razorpay</p>
                    <p className="text-sm text-gray-500">Enable Razorpay payment gateway</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">Stripe</p>
                    <p className="text-sm text-gray-500">Enable Stripe payment gateway</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Accept COD payments</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
                  <Input type="password" defaultValue="rzp_live_****************" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key Secret</label>
                  <Input type="password" defaultValue="********************************" />
                </div>
              </div>
            </div>
          )}

          {/* Show placeholder for other sections */}
          {!['general', 'email', 'payment'].includes(activeSection) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                {(() => {
                  const SectionIcon = settingsSections.find(s => s.id === activeSection)?.icon || Store;
                  return <SectionIcon className="h-8 w-8 text-gray-400" />;
                })()}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 capitalize">{activeSection} Settings</h3>
              <p className="mt-2 text-sm text-gray-500">Configure your {activeSection} preferences here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
