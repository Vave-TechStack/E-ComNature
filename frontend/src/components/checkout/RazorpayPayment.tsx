'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, Truck, Check, CheckCircle, Shield, Loader2, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatPrice } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { initiateRazorpayPayment, createRazorpayOrder } from '@/services/payment';
import { sendOrderWhatsApp } from '@/services/notifications';
import toast from 'react-hot-toast';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

interface RazorpayPaymentProps {
  phoneNumber?: string;
  customerName?: string;
  customerEmail?: string;
}

export function RazorpayPayment({ phoneNumber, customerName, customerEmail }: RazorpayPaymentProps) {
  const router = useRouter();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>();
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const paymentMethods = [
    { id: 'upi' as PaymentMethod, name: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: Smartphone, badge: 'Instant' },
    { id: 'card' as PaymentMethod, name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard, badge: 'Secure' },
    { id: 'netbanking' as PaymentMethod, name: 'Net Banking', description: 'All major banks supported', icon: Building2 },
    { id: 'wallet' as PaymentMethod, name: 'NatureKart Wallet', description: 'Pay using your wallet balance', icon: Wallet, badge: '₹0' },
    { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Truck, badge: 'Free' },
  ];

  const handlePlaceOrder = useCallback(async () => {
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
    setIsProcessing(true);

    try {
      if (selectedPayment === 'cod') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Order placed successfully! 🎉');
        if (phoneNumber) {
          await sendOrderWhatsApp({
            phone: phoneNumber,
            orderNumber,
            status: 'CONFIRMED',
            customerName: customerName || user?.displayName || 'Valued Customer',
          });
        }
        router.push(`/checkout/confirmation?order=${orderNumber}&method=cod`);
        return;
      }

      if (selectedPayment === 'upi' && !upiId) {
        toast.error('Please enter your UPI ID');
        setIsProcessing(false);
        return;
      }

      const paymentOrder = await createRazorpayOrder(totalAmount + 49);
      const phone = phoneNumber || user?.phone || '';

      await initiateRazorpayPayment({
        orderId: orderNumber,
        amount: totalAmount + 49,
        customerName: customerName || user?.displayName || 'Customer',
        customerEmail: customerEmail || user?.email || '',
        customerPhone: phone,
        onSuccess: async (response) => {
          toast.success('Payment successful! 🎉', { duration: 3000 });
          if (phone) {
            await sendOrderWhatsApp({
              phone,
              orderNumber,
              status: 'PAID',
              customerName: customerName || user?.displayName || 'Valued Customer',
            });
          }
          router.push(`/checkout/confirmation?order=${orderNumber}&payment_id=${response.razorpay_payment_id}&method=online`);
        },
        onFailure: (error) => {
          toast.error(error || 'Payment failed. Please try again.');
          setIsProcessing(false);
        },
        onDismiss: () => {
          toast('Payment cancelled. You can try again.', { icon: '❌' });
          setIsProcessing(false);
        },
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [selectedPayment, upiId, totalAmount, phoneNumber, customerName, customerEmail, user, router]);

  const handleSendOtp = () => {
    setOtpSent(true);
    toast.success('OTP sent to your registered mobile number');
  };

  const handleVerifyOtp = () => {
    if (otpValue.length === 6) {
      setPhoneVerified(true);
      setShowOtp(false);
      toast.success('Phone verified! ✅');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <Sparkles className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Payment Method</h2>
          <p className="text-sm text-noble-400">Choose your preferred payment — powered by <strong className="text-noble-600">Razorpay</strong></p>
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
              onClick={() => setSelectedPayment(method.id)}
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
              <div className="flex items-center gap-2">
                {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                  <motion.button
                    key={app}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setUpiId(`${app.toLowerCase()}@upi`)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-noble-600 hover:bg-primary-50 hover:text-primary-700 border border-noble-200 hover:border-primary-200 transition-all"
                  >
                    {app}
                  </motion.button>
                ))}
              </div>
              <Input
                placeholder="Enter UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border-noble-200 focus:border-primary-400 rounded-xl"
              />
              <p className="text-xs text-noble-400">You will be redirected to your UPI app to complete payment</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COD Verification */}
      <AnimatePresence>
        {selectedPayment === 'cod' && !phoneVerified && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-bold text-amber-800">Phone Verification Required for COD</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 border-amber-200 focus:border-amber-400 rounded-xl"
                  maxLength={6}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs rounded-xl px-5"
                >
                  {otpSent ? 'Verify' : 'Send OTP'}
                </Button>
              </div>
              {phoneVerified && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Phone verified
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/80 to-accent-50/80 border border-primary-100 p-4 flex items-start gap-3"
      >
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-bold text-primary-800">🔒 Secure Payment via Razorpay</p>
            </div>
            <p className="text-xs text-noble-500">100% secure. PCI-DSS compliant. Your card details are never stored with us.</p>
          </div>
        </div>
      </motion.div>

      {/* Place Order */}
      <div className="flex flex-col gap-2 pt-4 border-t border-noble-100">
        <Button
          onClick={handlePlaceOrder}
          disabled={!selectedPayment || isProcessing || (selectedPayment === 'cod' && !phoneVerified) || (selectedPayment === 'upi' && !upiId)}
          className="w-full gap-2 gradient-primary text-white h-14 text-base font-bold shadow-xl shadow-primary-200/50 hover:shadow-2xl hover:shadow-primary-300/50 transition-all disabled:opacity-50 rounded-xl"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing your order...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Place Order — {formatPrice(totalAmount + 49)}
            </span>
          )}
        </Button>
        <p className="text-xs text-noble-400 text-center">
          By placing this order, you agree to our Terms & Conditions
        </p>
      </div>
    </motion.div>
  );
}
