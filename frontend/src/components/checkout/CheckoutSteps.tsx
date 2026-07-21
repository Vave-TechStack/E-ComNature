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
                <motion.button
                  whileHover={isCompleted || isCurrent ? { scale: 1.05 } : {}}
                  whileTap={isCompleted || isCurrent ? { scale: 0.95 } : {}}
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!isCompleted && !isCurrent}
                  className={cn(
                    'relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300',
                    isCompleted && 'bg-primary-600 text-white cursor-pointer shadow-lg shadow-primary-200',
                    isCurrent && 'bg-gradient-to-br from-primary-600 to-emerald-500 text-white shadow-xl shadow-primary-200/50 ring-4 ring-primary-100',
                    !isCompleted && !isCurrent && 'bg-noble-50 text-noble-300 border-2 border-noble-200 cursor-default'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}

                  {/* Pulse ring for current step */}
                  {isCurrent && (
                    <motion.span
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full bg-primary-400"
                    />
                  )}
                </motion.button>

                <motion.span
                  initial={false}
                  animate={{
                    color: isCompleted || isCurrent ? '#065F46' : '#A7A99A',
                    fontWeight: isCompleted || isCurrent ? 600 : 400,
                  }}
                  className="mt-2 text-xs sm:text-sm font-medium transition-colors hidden sm:block"
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connector */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="relative h-1 rounded-full overflow-hidden bg-noble-100">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                      }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 via-emerald-400 to-accent-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decorative accent */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex justify-center mt-4 origin-center"
      >
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
          <Leaf className="h-3.5 w-3.5 text-primary-300" />
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
