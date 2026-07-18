'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { loginSchema, type LoginFormData } from '@/lib/validators/auth';
import { signIn } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(login({
      emailOrPhone: data.emailOrPhone,
      password: data.password,
    }));
    
    if (login.fulfilled.match(result)) {
      const user = result.payload;
      
      // Also create NextAuth session so middleware recognizes the user
      const nextAuthResult = await signIn('credentials', {
        emailOrPhone: data.emailOrPhone,
        password: data.password,
        redirect: false,
      });
      
      if (nextAuthResult?.error) {
        console.error('NextAuth signIn failed:', nextAuthResult.error);
      }
      
      // Redirect admin users to admin dashboard
      if (user.role === 'ROLE_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue shopping"
      alternateLink={{
        text: "Don't have an account?",
        href: '/auth/register',
        label: 'Create one',
      }}
    >
      {/* Dummy Credentials Banner */}
      <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-accent-50 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-primary-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Demo Accounts</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-primary-600 text-white border-0 text-[10px] px-2 py-0.5">Admin</Badge>
            <code className="bg-white/80 px-2 py-1 rounded text-xs font-mono text-gray-700">admin@naturekart.in</code>
            <span className="text-xs text-gray-400">/</span>
            <code className="bg-white/80 px-2 py-1 rounded text-xs font-mono text-gray-700">Admin@123</code>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('emailOrPhone') as HTMLInputElement;
                const pw = document.getElementById('password') as HTMLInputElement;
                if (el && pw) { el.value = 'admin@naturekart.in'; pw.value = 'Admin@123'; }
              }}
              className="ml-auto text-[10px] text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2 shrink-0"
            >
              Auto-fill
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-accent-600 text-white border-0 text-[10px] px-2 py-0.5">User</Badge>
            <code className="bg-white/80 px-2 py-1 rounded text-xs font-mono text-gray-700">user@naturekart.in</code>
            <span className="text-xs text-gray-400">/</span>
            <code className="bg-white/80 px-2 py-1 rounded text-xs font-mono text-gray-700">User@123</code>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('emailOrPhone') as HTMLInputElement;
                const pw = document.getElementById('password') as HTMLInputElement;
                if (el && pw) { el.value = 'user@naturekart.in'; pw.value = 'User@123'; }
              }}
              className="ml-auto text-[10px] text-accent-600 hover:text-accent-700 font-medium underline underline-offset-2 shrink-0"
            >
              Auto-fill
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Email/Phone */}
        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email or Phone
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="Enter your email or phone"
              className="pl-10 h-12"
              {...register('emailOrPhone')}
              aria-invalid={errors.emailOrPhone ? 'true' : 'false'}
            />
          </div>
          {errors.emailOrPhone && (
            <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-12"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold gradient-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Social Login */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {/* Google OAuth */}}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {/* OTP Login */}}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
              <path d="M7 12h10M12 7v10"/>
            </svg>
            Phone OTP
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
