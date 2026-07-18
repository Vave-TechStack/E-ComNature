'use client';

import { motion } from 'framer-motion';
import { MapPin, Truck, CreditCard, ClipboardCheck, Check, Leaf, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Verify', icon: Smartphone },
  { id: 5, label: 'Review', icon: ClipboardCheck },
];

interface CheckoutStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!isCompleted && !isCurrent}
                  className={cn(
                    'relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-300 shadow-sm',
                    isCompleted && 'bg-primary-600 text-white cursor-pointer shadow-primary-200',
                    isCurrent && 'gradient-primary text-white shadow-lg shadow-primary-200',
                    !isCompleted && !isCurrent && 'bg-primary-50 text-primary-300 border-2 border-primary-100 cursor-default'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </button>
                <span className={cn(
                  'mt-2 text-xs sm:text-sm font-medium transition-colors hidden sm:block',
                  (isCompleted || isCurrent) ? 'text-primary-700' : 'text-gray-400'
                )}>
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="relative h-1">
                    <div className="absolute inset-0 bg-primary-100 rounded-full" />
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Decorative leaf accent */}
      <div className="flex justify-center mt-4">
        <Leaf className="h-3.5 w-3.5 text-primary-300" />
      </div>
    </div>
  );
}
