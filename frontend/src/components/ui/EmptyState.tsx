'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Heart,
  SearchX,
  MapPin,
  CreditCard,
  Bell,
  Star,
  Gift,
  Inbox,
  FileText,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type EmptyStateIcon = 
  | 'cart' 
  | 'orders' 
  | 'wishlist' 
  | 'search' 
  | 'address' 
  | 'payment' 
  | 'notification' 
  | 'review' 
  | 'reward' 
  | 'inbox' 
  | 'invoice' 
  | 'generic';

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline';
}

interface EmptyStateProps {
  icon?: EmptyStateIcon;
  customIcon?: LucideIcon;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
  compact?: boolean;
}

const iconMap: Record<EmptyStateIcon, LucideIcon> = {
  cart: ShoppingBag,
  orders: Package,
  wishlist: Heart,
  search: SearchX,
  address: MapPin,
  payment: CreditCard,
  notification: Bell,
  review: Star,
  reward: Gift,
  inbox: Inbox,
  invoice: FileText,
  generic: AlertCircle,
};

const iconColors: Record<EmptyStateIcon, string> = {
  cart: 'text-amber-500',
  orders: 'text-blue-500',
  wishlist: 'text-rose-500',
  search: 'text-gray-400',
  address: 'text-emerald-500',
  payment: 'text-violet-500',
  notification: 'text-sky-500',
  review: 'text-yellow-500',
  reward: 'text-purple-500',
  inbox: 'text-indigo-500',
  invoice: 'text-teal-500',
  generic: 'text-gray-400',
};

const ringLightColors: Record<EmptyStateIcon, string> = {
  cart: '#fef3c7', orders: '#dbeafe', wishlist: '#fce7f3', search: '#f9fafb',
  address: '#d1fae5', payment: '#ede9fe', notification: '#e0f2fe', review: '#fef9c3',
  reward: '#f3e8ff', inbox: '#eef2ff', invoice: '#ccfbf1', generic: '#f9fafb',
};

const ringDarkColors: Record<EmptyStateIcon, string> = {
  cart: '#f59e0b', orders: '#3b82f6', wishlist: '#f43f5e', search: '#9ca3af',
  address: '#10b981', payment: '#8b5cf6', notification: '#0ea5e9', review: '#eab308',
  reward: '#a855f7', inbox: '#6366f1', invoice: '#14b8a6', generic: '#9ca3af',
};

const particleFillColors: Record<EmptyStateIcon, string> = {
  cart: '#fde68a', orders: '#93c5fd', wishlist: '#fbcfe8', search: '#e5e7eb',
  address: '#a7f3d0', payment: '#ddd6fe', notification: '#bae6fd', review: '#fde68a',
  reward: '#d8b4fe', inbox: '#c7d2fe', invoice: '#99f6e4', generic: '#e5e7eb',
};

const iconBgs: Record<EmptyStateIcon, string> = {
  cart: 'bg-amber-50',
  orders: 'bg-blue-50',
  wishlist: 'bg-rose-50',
  search: 'bg-gray-50',
  address: 'bg-emerald-50',
  payment: 'bg-violet-50',
  notification: 'bg-sky-50',
  review: 'bg-yellow-50',
  reward: 'bg-purple-50',
  inbox: 'bg-indigo-50',
  invoice: 'bg-teal-50',
  generic: 'bg-gray-50',
};

const illustrations: Record<EmptyStateIcon, { rings: number; particles: boolean }> = {
  cart: { rings: 3, particles: false },
  orders: { rings: 2, particles: true },
  wishlist: { rings: 3, particles: true },
  search: { rings: 1, particles: false },
  address: { rings: 2, particles: false },
  payment: { rings: 2, particles: true },
  notification: { rings: 1, particles: false },
  review: { rings: 3, particles: true },
  reward: { rings: 2, particles: false },
  inbox: { rings: 2, particles: false },
  invoice: { rings: 1, particles: false },
  generic: { rings: 1, particles: false },
};

function EmptyIllustration({ icon }: { icon: EmptyStateIcon }) {
  const config = illustrations[icon];

  return (
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative rings */}
      {Array.from({ length: config.rings }).map((_, i) => (
        <motion.circle
          key={i}
          cx="60"
          cy="60"
          r={40 + i * 14}
          stroke={`url(#ring-${icon}-${i})`}
          strokeWidth="1"
          strokeDasharray={i === 1 ? '4 4' : '2 6'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3 - i * 0.08, scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* Floating particles */}
      {config.particles && (
        <>
          {[
            { cx: 25, cy: 30, r: 2, delay: 0.2 },
            { cx: 95, cy: 35, r: 1.5, delay: 0.5 },
            { cx: 85, cy: 80, r: 2.5, delay: 0.8 },
            { cx: 30, cy: 85, r: 1.8, delay: 0.3 },
          ].map((p, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={particleFillColors[icon]}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0], y: [-5, -15, -25] }}
              transition={{
                duration: 3,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Gradients */}
      <defs>
        {Array.from({ length: config.rings }).map((_, i) => (
          <linearGradient key={i} id={`ring-${icon}-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ringLightColors[icon]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ringDarkColors[icon]} stopOpacity="0.3" />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export function EmptyState({
  icon = 'generic',
  customIcon: CustomIcon,
  title,
  description,
  actions = [],
  className = '',
  compact = false,
}: EmptyStateProps) {
  const Icon = CustomIcon || iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      {/* Illustration */}
      <motion.div
        className={`relative ${compact ? 'w-24 h-24 mb-4' : 'w-36 h-36 mb-6'} ${iconBgs[icon]} rounded-full flex items-center justify-center overflow-hidden`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* SVG decorative rings */}
        <div className={`absolute inset-0 ${compact ? 'scale-50' : ''}`}>
          <EmptyIllustration icon={icon} />
        </div>

        {/* Main icon */}
        <motion.div
          className={`relative z-10 ${compact ? 'p-2' : 'p-3'}`}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} ${iconColors[icon]}`} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="max-w-sm"
      >
        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        {description && (
          <p className={`mt-1.5 text-gray-500 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
            {description}
          </p>
        )}
      </motion.div>

      {/* Actions */}
      {actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`flex flex-wrap items-center justify-center gap-3 ${compact ? 'mt-4' : 'mt-6'}`}
        >
          {actions.map((action, idx) => {
            const btn = (
              <Button
                key={idx}
                variant={action.variant || (idx === 0 ? 'default' : 'outline')}
                size={compact ? 'sm' : 'default'}
                className="rounded-full"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            );

            if (action.href) {
              return (
                <Link key={idx} href={action.href}>
                  {btn}
                </Link>
              );
            }
            return btn;
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
