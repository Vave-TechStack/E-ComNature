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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
          <Truck className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Choose Shipping Method</h2>
          <p className="text-sm text-gray-500">Select your preferred delivery option</p>
        </div>
      </div>

      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedShipping === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.005 }}
              onClick={() => onSelect(option.id)}
              className={cn(
                'relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                  : 'border-primary-100 hover:border-primary-300 bg-white hover:shadow-sm'
              )}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', isSelected ? 'bg-primary-100' : 'bg-primary-50')}>
                <Icon className={cn('h-7 w-7', isSelected ? 'text-primary-600' : 'text-primary-400')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{option.name}</p>
                  {option.badge && (
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      option.badge === 'Popular' ? 'bg-accent-100 text-accent-700' :
                      option.badge === 'Fastest' ? 'bg-blue-100 text-blue-700' :
                      'bg-primary-100 text-primary-700'
                    )}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                <p className="mt-1 text-xs font-semibold text-primary-600">{option.estimatedDays}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn('text-xl font-bold', isSelected ? 'text-primary-700' : 'text-gray-900')}>
                  {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                </p>
                {option.price > 0 && <p className="text-xs text-gray-400">delivery fee</p>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
        <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 gap-2">
          ← Back
        </Button>
        <Button onClick={onNext} disabled={!selectedShipping} className="gap-2 gradient-primary text-white px-8 h-11 text-sm font-semibold shadow-lg shadow-primary-200 disabled:opacity-50">
          Continue to Payment →
        </Button>
      </div>
    </motion.div>
  );
}
