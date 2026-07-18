'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, Truck, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

const paymentMethods = [
  { id: 'upi' as PaymentMethod, name: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card' as PaymentMethod, name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard },
  { id: 'netbanking' as PaymentMethod, name: 'Net Banking', description: 'All major banks supported', icon: Building2 },
  { id: 'wallet' as PaymentMethod, name: 'NatureKart Wallet', description: 'Pay using your wallet balance', icon: Wallet },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Truck },
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
          <CreditCard className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-sm text-gray-500">Choose your preferred payment method — all transactions are secure</p>
        </div>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedPayment === method.id;
          return (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.005 }}
              onClick={() => onSelect(method.id)}
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
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* UPI Input */}
      <AnimatePresence>
        {selectedPayment === 'upi' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-primary-100 bg-white p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Enter your UPI ID</p>
              <Input placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="border-primary-200" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Form */}
      <AnimatePresence>
        {selectedPayment === 'card' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-primary-100 bg-white p-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Card Details</p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" maxLength={19} className="border-primary-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                  <Input placeholder="MM/YY" maxLength={5} className="border-primary-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CVV</label>
                  <Input type="password" placeholder="***" maxLength={4} className="border-primary-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name on Card</label>
                <Input placeholder="John Doe" className="border-primary-200" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Notice */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-800">🔒 Secure Payment</p>
          <p className="text-xs text-gray-500 mt-0.5">Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
        <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 gap-2">← Back</Button>
        <Button onClick={handleProceed} disabled={!selectedPayment} className="gap-2 gradient-primary text-white px-8 h-11 text-sm font-semibold shadow-lg shadow-primary-200 disabled:opacity-50">
          Continue to Review →
        </Button>
      </div>
    </motion.div>
  );
}
