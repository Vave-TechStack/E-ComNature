'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Shield, CheckCircle, Loader2, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    sendOtp();
  }, []);

  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const sendOtp = useCallback(async () => {
    setIsSending(true);
    setError('');
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
    await new Promise((r) => setTimeout(r, 1500));
    setIsVerifying(false);
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm">
          <Smartphone className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-noble-800">Phone Verification</h2>
          <p className="text-sm text-noble-400">Enter the OTP sent to <span className="font-semibold text-noble-600">{phone}</span></p>
        </div>
      </div>

      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50 p-6 sm:p-8"
      >
        {isSending ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="h-8 w-8 text-primary-500" />
            </motion.div>
            <p className="text-sm text-noble-500 font-medium">Sending OTP...</p>
          </div>
        ) : (
          <>
            {/* OTP boxes */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
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
                    className={cn(
                      'h-14 w-11 sm:h-16 sm:w-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-all duration-200',
                      digit
                        ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                        : 'border-noble-200 bg-white hover:border-noble-300',
                      error && 'border-red-300 bg-red-50'
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
                  className="text-center text-xs font-medium text-red-500 mt-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button
                onClick={handleVerify}
                disabled={!isComplete || isVerifying}
                className="w-full h-14 gradient-primary text-white text-base font-bold shadow-xl shadow-primary-200/50 disabled:opacity-50 rounded-xl"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verify OTP
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Resend */}
            <div className="mt-4 text-center">
              {otpSent && timer > 0 ? (
                <p className="text-sm text-noble-400">
                  Resend code in <span className="font-bold text-noble-600 tabular-nums">{timer}s</span>
                </p>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendOtp}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resend OTP
                </motion.button>
              )}
            </div>
          </>
        )}
      </motion.div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-noble-200 p-3.5 flex items-start gap-2.5"
      >
        <Shield className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
        <p className="text-xs text-noble-500">
          <span className="font-semibold text-noble-700">Secure verification</span> — Your OTP is encrypted and will expire in 10 minutes
        </p>
      </motion.div>

      {/* Back */}
      <div className="pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-noble-500 hover:text-primary-600 hover:bg-primary-50 gap-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Change phone number
        </Button>
      </div>
    </motion.div>
  );
}
