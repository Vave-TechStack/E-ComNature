'use client';

import { motion } from 'framer-motion';
import {
  Shield, Leaf, Scale, Clock, Thermometer, Droplets, TreePine,
  FlaskConical, Package, Tractor, Sun, Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpecItem {
  key: string;
  value: string;
}

interface ProductSpecsProps {
  specifications: SpecItem[];
}

const specIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  source: TreePine,
  type: Leaf,
  'shelf life': Clock,
  storage: Package,
  'flavor notes': Droplets,
  'net weight': Scale,
  'harvest method': Tractor,
  certification: Shield,
  origin: Sun,
  process: Wind,
  ingredients: FlaskConical,
};

function getSpecIcon(key: string) {
  const normalizedKey = key.toLowerCase().trim();
  for (const [k, Icon] of Object.entries(specIconMap)) {
    if (normalizedKey.includes(k)) return Icon;
  }
  return Package;
}

function getSpecColor(key: string) {
  const normalizedKey = key.toLowerCase().trim();
  if (normalizedKey.includes('certif') || normalizedKey.includes('organic')) return 'emerald';
  if (normalizedKey.includes('weight') || normalizedKey.includes('net')) return 'blue';
  if (normalizedKey.includes('shelf') || normalizedKey.includes('storage')) return 'amber';
  if (normalizedKey.includes('flavor') || normalizedKey.includes('taste')) return 'rose';
  if (normalizedKey.includes('source') || normalizedKey.includes('origin')) return 'violet';
  if (normalizedKey.includes('harvest') || normalizedKey.includes('process')) return 'teal';
  return 'primary';
}

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-200' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-200' },
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', border: 'border-primary-200' },
};

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="rounded-2xl bg-noble-50 p-8 text-center">
        <Package className="h-10 w-10 text-noble-300 mx-auto mb-3" />
        <p className="text-sm text-noble-500 font-medium">No specifications available</p>
        <p className="text-xs text-noble-400 mt-1">Check back soon for detailed product information.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {specifications.map((spec, index) => {
        const Icon = getSpecIcon(spec.key);
        const colors = colorMap[getSpecColor(spec.key)] || colorMap.primary;

        return (
          <motion.div
            key={spec.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className={cn(
              'group relative flex items-start gap-3.5 rounded-xl border p-4 transition-all duration-200',
              colors.border,
              'hover:shadow-lg hover:-translate-y-0.5'
            )}
            style={{ backgroundColor: `${colors.bg}80` }}
          >
            {/* Icon container */}
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 group-hover:scale-110',
                colors.bg,
                colors.border,
                colors.icon
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-noble-400 mb-0.5">
                {spec.key}
              </p>
              <p className="text-sm font-medium text-noble-800 leading-snug break-words">
                {spec.value}
              </p>
            </div>

            {/* Hover accent */}
            <div className={cn(
              'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
              'bg-gradient-to-br from-white/50 to-transparent'
            )} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
