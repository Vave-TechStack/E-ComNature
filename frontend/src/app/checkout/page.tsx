'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Leaf, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { AddressStep } from '@/components/checkout/AddressStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { RazorpayPayment } from '@/components/checkout/RazorpayPayment';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { OtpVerification } from '@/components/checkout/OtpVerification';
import { useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/lib/utils';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [selectedShipping, setSelectedShipping] = useState<string | undefined>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-natural">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 border-2 border-primary-100 mb-4">
            <ShoppingBag className="h-12 w-12 text-primary-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Add some natural products before checking out</p>
          <Link href="/products">
            <Button className="mt-6 gradient-primary text-white shadow-lg shadow-primary-200 font-semibold">
              <Leaf className="h-4 w-4 mr-2" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    router.push('/checkout/confirmation');
  }, [router]);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <AddressStep selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} onNext={() => setCurrentStep(2)} />;
      case 2: return <ShippingStep selectedShipping={selectedShipping} onSelect={setSelectedShipping} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3: return <RazorpayPayment
        phoneNumber={user?.phone}
        customerName={user?.displayName}
        customerEmail={user?.email}
      />;
      case 4: return <OtpVerification phone="9876543210" onVerified={() => { setPhoneVerified(true); setCurrentStep(5); }} onBack={() => setCurrentStep(3)} />;
      case 5: return <ReviewStep onNext={handlePlaceOrder} onBack={() => setCurrentStep(selectedPayment === 'cod' && !phoneVerified ? 4 : 3)} selectedAddressId={selectedAddressId} selectedShipping={selectedShipping} selectedPayment={selectedPayment} isProcessing={isProcessing} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-natural">
      {/* Header */}
      <div className="border-b border-primary-100 bg-white">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                <p className="text-xs text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'} • {formatPrice(totalAmount)}</p>
              </div>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5 text-primary-400" />
              Secure checkout
            </div>
          </div>
          <CheckoutSteps currentStep={currentStep} />
        </div>
      </div>

      {/* Steps */}
      <div className="container-custom py-6 md:py-8">
        <div className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
