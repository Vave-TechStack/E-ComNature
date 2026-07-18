'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { registerSchema, type RegisterFormData } from '@/lib/validators/auth';
import { signIn } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register as registerUser, clearError } from '@/store/slices/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser({
      firstName: data.firstName,
      lastName: data.lastName || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      password: data.password,
      referralCode: data.referralCode || undefined,
    }));
    
    if (registerUser.fulfilled.match(result)) {
      // Also create NextAuth session so middleware recognizes the user
      const nextAuthResult = await signIn('credentials', {
        emailOrPhone: data.email || data.phone || '',
        password: data.password,
        redirect: false,
      });
      
      if (nextAuthResult?.error) {
        console.error('NextAuth signIn failed:', nextAuthResult.error);
      }
      
      router.push('/');
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 0
      ? ['firstName', 'lastName', 'email', 'phone']
      : ['password', 'confirmPassword'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep(currentStep + 1);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join NatureKart and start shopping premium natural products"
      alternateLink={{
        text: 'Already have an account?',
        href: '/auth/login',
        label: 'Sign in',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive">
              <AlertDescription onClick={() => dispatch(clearError())}>
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-6">
          {[0, 1].map((step) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`h-2 rounded-full transition-all duration-300 flex-1 ${
                step <= currentStep ? 'gradient-primary' : 'bg-gray-200'
              }`} />
            </div>
          ))}
        </div>

        {currentStep === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input id="firstName" placeholder="John" className="pl-10 h-11" {...register('firstName')} />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <Input id="lastName" placeholder="Doe" className="h-11" {...register('lastName')} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="email" type="email" placeholder="john@example.com" className="pl-10 h-11" {...register('email')} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="phone" type="tel" placeholder="9876543210" className="pl-10 h-11" {...register('phone')} />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <Button type="button" onClick={nextStep} className="w-full h-11 gradient-primary">
              Continue
            </Button>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Security & Referral</h3>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-11"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="pl-10 h-11"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="referralCode" placeholder="Enter referral code" className="pl-10 h-11" {...register('referralCode')} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setCurrentStep(0)} className="flex-1 h-11">
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-[2] h-11 gradient-primary">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
