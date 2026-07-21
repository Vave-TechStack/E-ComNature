'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Store, Mail, Shield, CreditCard, Bell, Globe, Palette, Truck,
  CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const settingsSections = [
  { id: 'general', label: 'General', icon: Store, desc: 'Store name, tagline, currency' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'SMTP, templates, notifications' },
  { id: 'security', label: 'Security', icon: Shield, desc: '2FA, passwords, sessions' },
  { id: 'payment', label: 'Payment', icon: CreditCard, desc: 'Gateways, methods, keys' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email alerts, push, SMS' },
  { id: 'shipping', label: 'Shipping', icon: Truck, desc: 'Zones, rates, carriers' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme, colors, branding' },
  { id: 'seo', label: 'SEO', icon: Globe, desc: 'Meta, sitemap, robots' },
];

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  label: string;
  description: string;
}

function ToggleSwitch({ defaultChecked = false, label, description }: ToggleSwitchProps) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-xl border border-noble-200/60 bg-white/50 backdrop-blur-sm p-4 hover:shadow-sm hover:border-noble-300/80 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-noble-100 text-noble-400'}`}>
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-noble-800">{label}</p>
          <p className="text-xs text-noble-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 ${
          enabled
            ? 'bg-gradient-to-r from-primary-600 to-emerald-500'
            : 'bg-noble-200'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-noble-200/50 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </motion.div>
  );
}

interface FormFieldProps {
  label: string;
  defaultValue?: string;
  type?: string;
  colSpan?: boolean;
  placeholder?: string;
}

function FormField({ label, defaultValue, type = 'text', colSpan = false, placeholder }: FormFieldProps) {
  return (
    <div className={colSpan ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-semibold text-noble-700 mb-1.5">{label}</label>
      <Input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 rounded-xl border-noble-200/60 bg-white/70 backdrop-blur-sm text-sm text-noble-800 placeholder:text-noble-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
      />
    </div>
  );
}

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-noble-800">Settings</h1>
          <p className="text-sm text-noble-500">Manage your store configuration</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-200/50 transition-all hover:shadow-xl hover:shadow-primary-200/60"
        >
          <Save className="h-4 w-4" /> Save Changes
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="lg:w-56 shrink-0"
        >
          <div className="rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-2 shadow-sm">
            <div className="space-y-0.5">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-emerald-50 text-primary-700 shadow-sm'
                        : 'text-noble-500 hover:bg-noble-50/70 hover:text-noble-700'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-primary-600 to-emerald-500"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-tight">{section.label}</p>
                      <p className="text-[10px] text-noble-400 leading-tight mt-0.5 hidden lg:block">{section.desc}</p>
                    </div>
                    <ChevronRight className={`h-3.5 w-3.5 ml-auto transition-all ${isActive ? 'text-primary-500 opacity-100' : 'text-noble-300 opacity-0'}`} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="flex-1 rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              className="space-y-6"
            >
              {/* General Settings */}
              {activeSection === 'general' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-emerald-100">
                      <Store className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-noble-800">General Settings</h2>
                      <p className="text-xs text-noble-500">Configure your store basics</p>
                    </div>
                  </div>
                  <div className="border-t border-noble-100/60" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Store Name" defaultValue="NatureKart" />
                    <FormField label="Store Email" defaultValue="admin@naturekart.com" />
                    <FormField label="Tagline" defaultValue="Pure & Natural Foods from Farm to Home" colSpan />
                    <div>
                      <label className="block text-sm font-semibold text-noble-700 mb-1.5">Currency</label>
                      <select className="h-10 w-full rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-noble-700 mb-1.5">Timezone</label>
                      <select className="h-10 w-full rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all">
                        <option>Asia/Kolkata (IST)</option>
                        <option>America/New_York (EST)</option>
                        <option>Europe/London (GMT)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email Settings */}
              {activeSection === 'email' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-noble-800">Email Settings</h2>
                      <p className="text-xs text-noble-500">Configure SMTP and email templates</p>
                    </div>
                  </div>
                  <div className="border-t border-noble-100/60" />
                  <div className="space-y-4">
                    <FormField label="SMTP Host" defaultValue="smtp.gmail.com" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="SMTP Port" defaultValue="587" />
                      <div>
                        <label className="block text-sm font-semibold text-noble-700 mb-1.5">Encryption</label>
                        <select className="h-10 w-full rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>
                    <FormField label="From Email" defaultValue="noreply@naturekart.com" />
                    <FormField label="SMTP Username" defaultValue="noreply@naturekart.com" />
                    <FormField label="SMTP Password" type="password" defaultValue="••••••••••••" />
                  </div>
                </>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-rose-100">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-noble-800">Security Settings</h2>
                      <p className="text-xs text-noble-500">Protect your store and customer data</p>
                    </div>
                  </div>
                  <div className="border-t border-noble-100/60" />
                  <div className="space-y-3">
                    <ToggleSwitch label="Two-Factor Authentication" description="Require 2FA for admin logins" defaultChecked />
                    <ToggleSwitch label="Login Notifications" description="Email alerts on new admin logins" defaultChecked />
                    <ToggleSwitch label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultChecked />
                    <ToggleSwitch label="IP Whitelisting" description="Restrict admin access to specific IPs" />
                    <div className="mt-4">
                      <FormField label="Current Password" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="New Password" type="password" placeholder="Enter new password" />
                      <FormField label="Confirm Password" type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                </>
              )}

              {/* Payment Settings */}
              {activeSection === 'payment' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-noble-800">Payment Settings</h2>
                      <p className="text-xs text-noble-500">Configure payment gateways and methods</p>
                    </div>
                  </div>
                  <div className="border-t border-noble-100/60" />
                  <div className="space-y-3">
                    <ToggleSwitch label="Razorpay" description="Enable Razorpay payment gateway" defaultChecked />
                    <ToggleSwitch label="Stripe" description="Enable Stripe payment gateway" />
                    <ToggleSwitch label="Cash on Delivery" description="Accept COD payments" defaultChecked />
                    <ToggleSwitch label="UPI AutoPay" description="Enable recurring UPI payments" />
                    <div className="mt-4 border-t border-noble-100/60 pt-4">
                      <h3 className="text-sm font-bold text-noble-800 mb-3">API Credentials</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Razorpay Key ID" type="password" defaultValue="rzp_live_****************" />
                        <FormField label="Razorpay Key Secret" type="password" defaultValue="********************************" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Other sections - placeholder with improved design */}
              {!['general', 'email', 'security', 'payment'].includes(activeSection) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-emerald-100/50 rounded-full blur-2xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-emerald-50 border border-noble-200/40">
                      {(() => {
                        const SectionIcon = settingsSections.find(s => s.id === activeSection)?.icon || Store;
                        return <SectionIcon className="h-9 w-9 text-primary-500" />;
                      })()}
                    </div>
                  </motion.div>
                  <h3 className="mt-5 text-lg font-bold text-noble-800 capitalize">{activeSection} Settings</h3>
                  <p className="mt-1.5 text-sm text-noble-500 max-w-xs">
                    Configure your {activeSection} preferences here. All changes are auto-saved.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-200/50 transition-all hover:shadow-xl"
                  >
                    <Lock className="h-4 w-4" /> Configure Now
                  </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
