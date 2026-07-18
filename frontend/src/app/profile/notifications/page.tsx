'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Smartphone, Tag, Truck, Megaphone, Star, Gift, Shield, CreditCard, Package, Award, Clock, RotateCcw, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  enabled: boolean;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };
}

const channels: NotificationChannel[] = [
  { id: 'email', label: 'Email', description: 'Send notifications via email', icon: Mail, enabled: true },
  { id: 'sms', label: 'SMS', description: 'Send notifications via text message', icon: MessageSquare, enabled: true },
  { id: 'push', label: 'Push Notifications', description: 'Send push notifications to your device', icon: Smartphone, enabled: false },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Send notifications via WhatsApp', icon: MessageSquare, enabled: true },
];

const initialPreferences: NotificationPreference[] = [
  {
    id: 'order_updates', label: 'Order Updates', description: 'Order confirmation, shipping, and delivery updates',
    icon: Package, channels: { email: true, sms: true, push: true, whatsapp: true },
  },
  {
    id: 'payment', label: 'Payment Notifications', description: 'Payment confirmation, refunds, and invoice alerts',
    icon: CreditCard, channels: { email: true, sms: true, push: true, whatsapp: false },
  },
  {
    id: 'offers', label: 'Offers & Deals', description: 'Personalized offers, flash sales, and discount alerts',
    icon: Tag, channels: { email: true, sms: false, push: true, whatsapp: true },
  },
  {
    id: 'shipping', label: 'Shipping Alerts', description: 'Shipping status changes and delivery timeline updates',
    icon: Truck, channels: { email: true, sms: true, push: true, whatsapp: true },
  },
  {
    id: 'marketing', label: 'Marketing & Promotions', description: 'New arrivals, brand stories, and promotional content',
    icon: Megaphone, channels: { email: true, sms: false, push: false, whatsapp: false },
  },
  {
    id: 'reviews', label: 'Review & Ratings', description: 'Review reminders, rating requests, and review replies',
    icon: Star, channels: { email: true, sms: false, push: true, whatsapp: false },
  },
  {
    id: 'rewards', label: 'Rewards & Points', description: 'Points earned, tier upgrades, and reward redemption alerts',
    icon: Award, channels: { email: true, sms: false, push: true, whatsapp: false },
  },
  {
    id: 'returns', label: 'Returns & Replacements', description: 'Return request status and replacement updates',
    icon: RotateCcw, channels: { email: true, sms: true, push: true, whatsapp: true },
  },
  {
    id: 'wishlist', label: 'Wishlist Alerts', description: 'Price drops and back-in-stock notifications for saved items',
    icon: Gift, channels: { email: false, sms: false, push: true, whatsapp: false },
  },
  {
    id: 'security', label: 'Security Alerts', description: 'Login alerts, password changes, and account security updates',
    icon: Shield, channels: { email: true, sms: true, push: true, whatsapp: true },
  },
];

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [globalChannels, setGlobalChannels] = useState(channels);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleChannel = (channelId: string, prefId: string) => {
    setPreferences(preferences.map((pref) =>
      pref.id === prefId
        ? { ...pref, channels: { ...pref.channels, [channelId]: !pref.channels[channelId as keyof typeof pref.channels] } }
        : pref
    ));
  };

  const toggleGlobalChannel = (channelId: string) => {
    const newEnabled = !globalChannels.find(c => c.id === channelId)?.enabled;
    setGlobalChannels(globalChannels.map((ch) =>
      ch.id === channelId ? { ...ch, enabled: newEnabled } : ch
    ));
    setPreferences(preferences.map((pref) => ({
      ...pref,
      channels: { ...pref.channels, [channelId]: newEnabled },
    })));
  };

  const toggleAllForPreference = (prefId: string, value: boolean) => {
    setPreferences(preferences.map((pref) =>
      pref.id === prefId
        ? { ...pref, channels: { email: value, sms: value, push: value, whatsapp: value } }
        : pref
    ));
  };

  const selectAll = () => {
    setPreferences(preferences.map((pref) => ({
      ...pref,
      channels: { email: true, sms: true, push: true, whatsapp: true },
    })));
  };

  const deselectAll = () => {
    const criticalIds = ['order_updates', 'payment', 'shipping', 'security'];
    setPreferences(preferences.map((pref) => ({
      ...pref,
      channels: {
        email: criticalIds.includes(pref.id),
        sms: criticalIds.includes(pref.id),
        push: criticalIds.includes(pref.id),
        whatsapp: criticalIds.includes(pref.id),
      },
    })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const channelIcons: Record<string, typeof Bell> = {
    email: Mail, sms: MessageSquare, push: Smartphone, whatsapp: MessageSquare,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          <p className="text-sm text-gray-500">Choose how and when you want to hear from us</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>Minimum</Button>
          <Button
            size="sm"
            className="gap-2 gradient-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="h-4 w-4" /> Saved</>
            ) : (
              <><Check className="h-4 w-4" /> Save Preferences</>
            )}
          </Button>
        </div>
      </div>

      {/* Global Channel Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Communication Channels</h3>
        <p className="text-xs text-gray-500 mb-4">Master toggle for each channel. Disabling a channel will override individual preferences.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {globalChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <label
                key={channel.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
                  channel.enabled
                    ? 'border-primary-200 bg-primary-50/50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  channel.enabled ? 'bg-primary-100' : 'bg-gray-200'
                )}>
                  <Icon className={cn('h-5 w-5', channel.enabled ? 'text-primary-600' : 'text-gray-400')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                  <p className="text-xs text-gray-500 truncate">{channel.description}</p>
                </div>
                <ToggleSwitch checked={channel.enabled} onChange={() => toggleGlobalChannel(channel.id)} />
              </label>
            );
          })}
        </div>
      </motion.div>

      {/* Preference Grid */}
      <div className="space-y-3">
        {preferences.map((pref, index) => {
          const Icon = pref.icon;
          const allOn = Object.values(pref.channels).every(Boolean);
          const allOff = Object.values(pref.channels).every(v => !v);
          return (
            <motion.div
              key={pref.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                    allOn ? 'bg-green-50' : allOff ? 'bg-gray-100' : 'bg-primary-50'
                  )}>
                    <Icon className={cn(
                      'h-5 w-5',
                      allOn ? 'text-green-600' : allOff ? 'text-gray-400' : 'text-primary-600'
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                    <p className="text-xs text-gray-500">{pref.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAllForPreference(pref.id, true)}
                    className={cn('text-xs px-2 py-1 rounded transition-colors', allOn ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-400 hover:text-gray-600')}
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleAllForPreference(pref.id, false)}
                    className={cn('text-xs px-2 py-1 rounded transition-colors', allOff ? 'bg-gray-100 text-gray-700 font-medium' : 'text-gray-400 hover:text-gray-600')}
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(pref.channels) as Array<keyof typeof pref.channels>).map((channelId) => {
                  const ChIcon = channelIcons[channelId];
                  const enabled = pref.channels[channelId];
                  const globalEnabled = globalChannels.find(c => c.id === channelId)?.enabled;
                  return (
                    <button
                      key={channelId}
                      onClick={() => globalEnabled && toggleChannel(channelId, pref.id)}
                      disabled={!globalEnabled}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                        enabled && globalEnabled
                          ? 'bg-primary-100 text-primary-700 shadow-sm'
                          : 'bg-gray-100 text-gray-400',
                        !globalEnabled && 'opacity-40 cursor-not-allowed'
                      )}
                      aria-label={`${pref.label} - ${channelId} ${enabled ? 'enabled' : 'disabled'}`}
                    >
                      <ChIcon className="h-3 w-3" />
                      {channelId === 'whatsapp' ? 'WA' : channelId.charAt(0).toUpperCase() + channelId.slice(1)}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          Quiet Hours
        </h3>
        <p className="text-xs text-gray-500 mb-4">Pause non-critical notifications during specific hours</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Enable Quiet Hours
          </label>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500">
                <option>10:00 PM</option>
                <option>11:00 PM</option>
                <option>12:00 AM</option>
              </select>
            </div>
            <span className="text-gray-400 mt-5">to</span>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500">
                <option>6:00 AM</option>
                <option>7:00 AM</option>
                <option>8:00 AM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Email Frequency */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Email Digest Frequency</h3>
        <p className="text-xs text-gray-500 mb-4">How often would you like to receive marketing and promotional emails?</p>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'instant', label: 'Real-time', desc: 'As they happen' },
            { value: 'daily', label: 'Daily Digest', desc: 'Once a day summary' },
            { value: 'weekly', label: 'Weekly Digest', desc: 'Once a week roundup' },
            { value: 'never', label: 'Unsubscribe', desc: 'No marketing emails' },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-3 rounded-xl border-2 border-gray-200 p-3 cursor-pointer hover:border-primary-300 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50">
              <input type="radio" name="emailFrequency" defaultChecked={option.value === 'daily'} className="mt-0.5 border-gray-300 text-primary-600 focus:ring-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save Bar (Mobile Sticky) */}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-white border-t border-gray-200 p-4 sm:rounded-xl sm:border sm:shadow-sm sm:static sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 hidden sm:block">Changes are saved to your account</p>
          <Button
            className="gap-2 gradient-primary ml-auto"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="h-4 w-4" /> Saved!</>
            ) : (
              <><Check className="h-4 w-4" /> Save Preferences</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => { e.stopPropagation(); onChange(); }}>
      <input type="checkbox" className="peer sr-only" checked={checked} readOnly />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
    </label>
  );
}
