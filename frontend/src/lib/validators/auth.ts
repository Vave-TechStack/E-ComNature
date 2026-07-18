import { z } from 'zod';

export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = /^[6-9]\d{9}$/.test(value);
        return isEmail || isPhone;
      },
      { message: 'Enter a valid email or phone number' }
    ),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
      'Password must contain at least one digit, one lowercase, one uppercase, and one special character'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  referralCode: z
    .string()
    .max(20, 'Invalid referral code')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
  path: ['email'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = /^[6-9]\d{9}$/.test(value);
        return isEmail || isPhone;
      },
      { message: 'Enter a valid email or phone number' }
    ),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export type OtpFormData = z.infer<typeof otpSchema>;
