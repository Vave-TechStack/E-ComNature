'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantOption {
  type: string;
  value: string;
  color?: string;
  inStock?: boolean;
  label?: string;
}

interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  type?: 'color' | 'size' | 'default';
  showStock?: boolean;
}

export function VariantSelector({
  label,
  options,
  selectedValue,
  onChange,
  type = 'default',
  showStock = true,
}: VariantSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-sm font-semibold text-noble-800">
          {label}:{' '}
          <span className="text-primary-600 font-bold">{selectedValue || 'Select an option'}</span>
        </p>
        {showStock && selectedValue && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-green-600 font-medium"
          >
            ✓ Selected
          </motion.span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isOutOfStock = option.inStock === false;

          if (type === 'color') {
            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => !isOutOfStock && onChange(option.value)}
                disabled={isOutOfStock}
                className={cn(
                  'relative h-11 w-11 rounded-full border-2 transition-all duration-200',
                  isSelected
                    ? 'border-primary-500 ring-2 ring-primary-500/30 scale-110 shadow-lg shadow-primary-100'
                    : 'border-noble-200 hover:border-noble-400',
                  isOutOfStock && 'opacity-30 cursor-not-allowed'
                )}
                title={option.value}
                aria-label={`Select ${option.value} variant`}
              >
                <span
                  className="absolute inset-1.5 rounded-full shadow-inner"
                  style={{ backgroundColor: option.color || '#ccc' }}
                />
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-white drop-shadow-lg" strokeWidth={3} />
                  </motion.span>
                )}
                {isOutOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <X className="h-4 w-4 text-noble-400" strokeWidth={2.5} />
                  </span>
                )}
              </motion.button>
            );
          }

          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => !isOutOfStock && onChange(option.value)}
              disabled={isOutOfStock}
              className={cn(
                'relative rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg shadow-primary-100/50'
                  : 'border-noble-200 text-noble-700 hover:border-noble-400 hover:bg-noble-50',
                isOutOfStock && 'opacity-40 cursor-not-allowed'
              )}
              aria-label={`Select ${option.value} ${label}`}
            >
              <div className="flex items-center gap-2">
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="h-3.5 w-3.5 text-primary-600" strokeWidth={3} />
                  </motion.div>
                )}
                <span>{option.label || option.value}</span>
                {isOutOfStock && (
                  <span className="text-xs text-noble-400">(Out of Stock)</span>
                )}
              </div>
              {isSelected && (
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary-500/20" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
