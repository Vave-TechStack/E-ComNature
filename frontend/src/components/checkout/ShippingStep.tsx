'use client';

import { motion } from 'framer-motion';
import { Truck, Package, Zap, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: typeof Truck;
  badge?: string;
}

const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Standard Delivery', description: 'Estimated delivery in 5-7 business days', price: 49, estimatedDays: '5-7 days', icon: Package, badge: 'Eco-friendly' },
  { id: 'express', name: 'Express Delivery', description: 'Estimated delivery in 2-3 business days', price: 99, estimatedDays: '2-3 days', icon: Truck, badge: 'Popular' },
  { id: 'same_day', name: 'Same Day Delivery', description: 'Order within next 2 hours for same-day delivery', price: 199, estimatedDays: 'Today', icon: Zap, badge: 'Fastest' },
];

interface ShippingStepProps {
  selectedShipping?: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ShippingStep({ selectedShipping, onSelect, onNext, onBack }: ShippingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <Truck className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Choose Shipping Method</h2>
          <p className="text-sm text-noble-400">Select your preferred delivery option</p>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="space-y-3">
        {shippingOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedShipping === option.id;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -1 }}
              onClick={() => onSelect(option.id)}
              className={cn(
                'relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100'
                  : 'border-noble-200 bg-white hover:border-noble-300 hover:shadow-md'
              )}
            >
              {/* Check indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-emerald-500 shadow-sm"
                >
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Icon */}
              <div className={cn(
                'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                isSelected ? 'bg-gradient-to-br from-primary-100 to-primary-50 shadow-sm' : 'bg-noble-50'
              )}>
                <Icon className={cn('h-7 w-7', isSelected ? 'text-primary-600' : 'text-noble-400')} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-noble-800">{option.name}</p>
                  {option.badge && (
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      option.badge === 'Popular'
                        ? 'bg-accent-50 text-accent-700 border-accent-200'
                        : option.badge === 'Fastest'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-primary-50 text-primary-700 border-primary-200'
                    )}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-noble-400 mt-0.5">{option.description}</p>
                <p className="mt-1 text-xs font-semibold text-primary-600 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> {option.estimatedDays}
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className={cn('text-xl font-bold', isSelected ? 'text-primary-600' : 'text-noble-800')}>
                  {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                </p>
                {option.price > 0 && <p className="text-xs text-noble-400">delivery fee</p>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Eco note */}
      <div className="rounded-xl bg-gradient-to-r from-green-50/50 to-primary-50/50 border border-noble-200 p-3.5 flex items-center gap-2.5">
        <Leaf className="h-4 w-4 text-green-500 shrink-0" />
        <p className="text-xs text-noble-500">
          <span className="font-semibold text-green-700">Eco-friendly packaging</span> — All our shipments use recyclable materials
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-noble-100">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-noble-500 hover:text-primary-600 hover:bg-primary-50 gap-2 rounded-xl"
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedShipping}
          className="gap-2 gradient-primary text-white px-8 h-12 text-sm font-bold shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50 transition-all disabled:opacity-50 rounded-xl"
        >
          Continue to Payment →
        </Button>
      </div>
    </motion.div>
  );
}
