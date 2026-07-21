'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Send, Trash2, Check, CheckCheck, Search,
  ShoppingCart, Package, Tag, AlertCircle, Megaphone,
  Gift, Star, Users, Plus, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const NOTIFICATIONS = [
  {
    id: 1, title: 'Your order has been shipped!', body: 'Order #NK-10481 is on its way. Track your package with Delhivery.',
    type: 'Order', audience: 'User: Rohan Gupta', sentAt: 'Today, 8:05 AM', read: false, channel: 'Push + Email', icon: Package, color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 2, title: 'Flash Sale — 25% off Honey!', body: 'Grab the best Himalayan honey at 25% off. Only 48 hours left!',
    type: 'Promotion', audience: 'All Customers', sentAt: 'Today, 7:00 AM', read: true, channel: 'Push + SMS', icon: Tag, color: 'text-emerald-600 bg-emerald-50',
  },
  {
    id: 3, title: 'Low stock alert — A2 Ghee (500ml)', body: 'Only 6 units remaining. Reorder from your supplier to avoid stockouts.',
    type: 'Alert', audience: 'Admin Team', sentAt: 'Yesterday, 4:30 PM', read: false, channel: 'Email', icon: AlertCircle, color: 'text-amber-600 bg-amber-50',
  },
  {
    id: 4, title: 'Welcome to NatureKart!', body: 'Hi Priya, thanks for joining. Here\'s your ₹50 welcome voucher — WELCOME50.',
    type: 'Onboarding', audience: 'User: Priya Sharma', sentAt: 'Yesterday, 11:00 AM', read: true, channel: 'Email', icon: Gift, color: 'text-pink-600 bg-pink-50',
  },
  {
    id: 5, title: 'Review your recent purchase', body: 'How did you like the Forest Raw Honey? Share your experience!',
    type: 'Review', audience: 'Segment: Delivered Orders', sentAt: '2 days ago', read: true, channel: 'Push + Email', icon: Star, color: 'text-yellow-600 bg-yellow-50',
  },
  {
    id: 6, title: 'New customers milestone — 10,000!', body: 'We\'ve hit 10,000 customers! Share this win with the team.',
    type: 'Announcement', audience: 'Staff', sentAt: '3 days ago', read: true, channel: 'Email', icon: Megaphone, color: 'text-violet-600 bg-violet-50',
  },
  {
    id: 7, title: 'Cart abandoned — ₹1,248 pending', body: 'Ananya Nair left 3 items in her cart. Send a reminder?',
    type: 'Order', audience: 'User: Ananya Nair', sentAt: '3 days ago', read: false, channel: 'Push', icon: ShoppingCart, color: 'text-blue-600 bg-blue-50',
  },
];

const CHANNELS = [
  { label: 'Push Notification', desc: 'Mobile & browser push alerts', icon: Bell, active: true },
  { label: 'Email', desc: 'Transactional & marketing emails', icon: Send, active: true },
  { label: 'SMS', desc: 'Order updates via text message', icon: Users, active: false },
];

const TYPE_COLORS: Record<string, string> = {
  Order: 'bg-blue-100 text-blue-700 border-blue-200',
  Promotion: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Alert: 'bg-amber-100 text-amber-700 border-amber-200',
  Onboarding: 'bg-pink-100 text-pink-700 border-pink-200',
  Review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Announcement: 'bg-violet-100 text-violet-700 border-violet-200',
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminNotificationsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const types = ['All', ...Array.from(new Set(NOTIFICATIONS.map(n => n.type)))];

  const filtered = notifs.filter(n =>
    (typeFilter === 'All' || n.type === typeFilter) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
  );

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-100">
              <Bell className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Comms</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-400 mt-0.5">{unread} unread · {notifs.length} total</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> Send Notification
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent', value: '48,240', bg: 'bg-gray-50', color: 'text-gray-800' },
          { label: 'Unread', value: unread, bg: 'bg-indigo-50', color: 'text-indigo-700' },
          { label: 'Open Rate', value: '68.4%', bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Click Rate', value: '12.1%', bg: 'bg-blue-50', color: 'text-blue-700' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Channel status */}
      <motion.div {...fade(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.label} className={cn(
              'flex items-center gap-3 rounded-xl border p-4',
              ch.active ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50'
            )}>
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl shrink-0',
                ch.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{ch.label}</p>
                <p className="text-xs text-gray-500">{ch.desc}</p>
              </div>
              <span className={cn(
                'ml-auto text-[10px] font-bold rounded-full px-2 py-0.5',
                ch.active ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              )}>
                {ch.active ? 'ON' : 'OFF'}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Search + Type filter */}
      <motion.div {...fade(0.12)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search notifications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-indigo-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
                typeFilter === t ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notification list */}
      <motion.div {...fade(0.16)} className="space-y-3">
        {filtered.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <motion.div key={notif.id} {...fade(i * 0.04)}
              className={cn(
                'group flex items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm',
                notif.read ? 'border-gray-200 bg-white' : 'border-indigo-200 bg-indigo-50/30'
              )}
            >
              {/* Icon */}
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', notif.color)}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className={cn('text-sm font-bold leading-snug', notif.read ? 'text-gray-800' : 'text-gray-900')}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  )}
                  <Badge className={cn('text-[10px] border ml-auto shrink-0', TYPE_COLORS[notif.type])}>
                    {notif.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.body}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[11px] text-gray-400">👤 {notif.audience}</span>
                  <span className="text-[11px] text-gray-400">📡 {notif.channel}</span>
                  <span className="text-[11px] text-gray-400 ml-auto">{notif.sentAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.read && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => markRead(notif.id)} title="Mark as read">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteNotif(notif.id)} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No notifications found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
