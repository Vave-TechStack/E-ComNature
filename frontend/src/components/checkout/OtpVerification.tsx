'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Shield, CheckCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OtpVerificationProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OtpVerification({ phone, onVerified, onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP on mount
  useEffect(() => {
    sendOtp();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = useCallback(async () => {
    setIsSending(true);
    setError('');
    // Simulate sending OTP
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    setOtpSent(true);
    setTimer(30);
    setOtp(Array(6).fill(''));
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    setIsVerifying(true);
    setError('');
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 1500));
    setIsVerifying(false);
    // For demo: accept '123456' or any repeating digit (reject others to show error handling)
    if (code === '123456' || /^(\d)\1{5}$/.test(code)) {
      onVerified();
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
          <Smartphone className="h-5 w-5 text-accent-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Verify Your Phone</h2>
          <p className="text-sm text-gray-500">
            Enter the OTP sent to <span className="font-semibold text-gray-700">{phone.replace(/(\d{5})\d{4}(\d{2})/, '$1****$2')}</span>
          </p>
        </div>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-2 sm:gap-3 py-4">
        {otp.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={cn(
                'h-14 w-11 sm:h-16 sm:w-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all outline-none',
                digit
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                  : 'border-gray-200 bg-white hover:border-gray-300',
                error && 'border-red-400 bg-red-50'
              )}
              aria-label={`OTP digit ${index + 1}`}
              autoFocus={index === 0}
            />
          </motion.div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-center text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Resend */}
      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-gray-400">
            Resend OTP in <span className="font-semibold text-gray-600">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={sendOtp}
            disabled={isSending}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Resend OTP
          </button>
        )}
      </div>

      {/* Security Note */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-800">🔒 Verified & Secure</p>
          <p className="text-xs text-gray-500 mt-0.5">
            OTP verification ensures your order reaches the right person. Your phone number is never shared.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-primary-100">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          className="gap-2 gradient-primary text-white px-8 h-11 text-sm font-semibold shadow-lg shadow-primary-200 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Verify & Continue
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
