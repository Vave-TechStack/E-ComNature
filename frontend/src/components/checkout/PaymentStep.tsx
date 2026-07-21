'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, Truck, Check, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

const paymentMethods = [
  { id: 'upi' as PaymentMethod, name: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: Smartphone, badge: 'Instant' },
  { id: 'card' as PaymentMethod, name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard, badge: 'Secure' },
  { id: 'netbanking' as PaymentMethod, name: 'Net Banking', description: 'All major banks supported', icon: Building2 },
  { id: 'wallet' as PaymentMethod, name: 'NatureKart Wallet', description: 'Pay using your wallet balance', icon: Wallet, badge: '₹0' },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Truck, badge: 'Free' },
];

interface PaymentStepProps {
  selectedPayment?: PaymentMethod;
  onSelect: (id: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PaymentStep({ selectedPayment, onSelect, onNext, onBack }: PaymentStepProps) {
  const [upiId, setUpiId] = useState('');

  const handleProceed = () => {
    if (selectedPayment === 'upi' && !upiId) return;
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <CreditCard className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Payment Method</h2>
          <p className="text-sm text-noble-400">Choose your preferred payment — all transactions are secure</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.map((method, index) => {
          const Icon = method.icon;
          const isSelected = selectedPayment === method.id;
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -1 }}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100'
                  : 'border-noble-200 bg-white hover:border-noble-300 hover:shadow-md'
              )}
            >
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

              <div className={cn(
                'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                isSelected ? 'bg-gradient-to-br from-primary-100 to-primary-50 shadow-sm' : 'bg-noble-50'
              )}>
                <Icon className={cn('h-7 w-7', isSelected ? 'text-primary-600' : 'text-noble-400')} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-noble-800">{method.name}</p>
                  {method.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-noble-400 mt-0.5">{method.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* UPI Input */}
      <AnimatePresence>
        {selectedPayment === 'upi' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50 p-5 space-y-3">
              <p className="text-sm font-bold text-noble-700">Enter your UPI ID</p>
              <div className="flex gap-2">
                {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiId(`${app.toLowerCase()}@upi`)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-noble-600 hover:bg-primary-50 hover:text-primary-700 border border-noble-200 hover:border-primary-200 transition-all"
                  >
                    {app}
                  </button>
                ))}
              </div>
              <Input
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border-noble-200 focus:border-primary-400 rounded-xl"
              />
              <p className="text-xs text-noble-400">You will be redirected to your UPI app to complete payment</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Form */}
      <AnimatePresence>
        {selectedPayment === 'card' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50 p-5 space-y-4">
              <p className="text-sm font-bold text-noble-700">Card Details</p>
              <div>
                <label className="block text-xs font-medium text-noble-500 mb-1">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" maxLength={19} className="border-noble-200 focus:border-primary-400 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-noble-500 mb-1">Expiry Date</label>
                  <Input placeholder="MM/YY" maxLength={5} className="border-noble-200 focus:border-primary-400 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-noble-500 mb-1">CVV</label>
                  <Input type="password" placeholder="***" maxLength={4} className="border-noble-200 focus:border-primary-400 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-noble-500 mb-1">Name on Card</label>
                <Input placeholder="John Doe" className="border-noble-200 focus:border-primary-400 rounded-xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/80 to-accent-50/80 border border-primary-100 p-4 flex items-start gap-3"
      >
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary-800">🔒 100% Secure Payment</p>
            <p className="text-xs text-noble-500 mt-0.5">Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>
      </motion.div>

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
          onClick={handleProceed}
          disabled={!selectedPayment}
          className="gap-2 gradient-primary text-white px-8 h-12 text-sm font-bold shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50 transition-all disabled:opacity-50 rounded-xl"
        >
          Continue to Review →
        </Button>
      </div>
    </motion.div>
  );
}
