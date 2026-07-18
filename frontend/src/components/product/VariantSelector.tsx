'use client';

import { cn } from '@/lib/utils';

interface VariantOption {
  type: string;
  value: string;
  color?: string;
  inStock?: boolean;
}

interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  type?: 'color' | 'size' | 'default';
}

export function VariantSelector({ label, options, selectedValue, onChange, type = 'default' }: VariantSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900 mb-2">
        {label}: <span className="text-primary-600 font-semibold">{selectedValue || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          if (type === 'color') {
            return (
              <button
                key={option.value}
                onClick={() => option.inStock !== false && onChange(option.value)}
                disabled={option.inStock === false}
                className={cn(
                  'relative h-10 w-10 rounded-full border-2 transition-all',
                  selectedValue === option.value
                    ? 'border-primary-500 ring-2 ring-primary-500/30 scale-110'
                    : 'border-gray-200 hover:border-gray-400',
                  option.inStock === false && 'opacity-30 cursor-not-allowed'
                )}
                title={option.value}
                aria-label={`Select ${option.value} color`}
              >
                <span
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: option.color || '#ccc' }}
                />
                {selectedValue === option.value && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-4 w-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={option.value}
              onClick={() => option.inStock !== false && onChange(option.value)}
              disabled={option.inStock === false}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                selectedValue === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400',
                option.inStock === false && 'opacity-30 cursor-not-allowed line-through'
              )}
            >
              {option.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
