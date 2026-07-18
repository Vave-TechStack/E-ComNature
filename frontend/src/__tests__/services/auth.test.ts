import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/auth';
import api from '@/services/api';
import type { AuthResponse } from '@/types';

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  const mockAuthResponse: AuthResponse = {
    userId: 1,
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 900,
    user: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      displayName: 'John Doe',
      profileImage: '',
      role: 'ROLE_CUSTOMER',
      emailVerified: true,
      phoneVerified: false,
      rewardPoints: 0,
      walletBalance: 0,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = { data: { success: true, message: 'Login successful', data: mockAuthResponse } };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.login({ emailOrPhone: 'john@example.com', password: 'Password@123' });

      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('accessToken')).toBe('test-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockAuthResponse.user));
    });

    it('should fallback to mock login when API is unavailable', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      // With mock fallback, login should succeed even without backend
      const result = await authService.login({ emailOrPhone: 'user@naturekart.in', password: 'User@123' });

      expect(result.user.email).toBe('user@naturekart.in');
      expect(localStorage.getItem('accessToken')).toContain('mock_access_token_');
    });
  });

  describe('register', () => {
    it('should register successfully and store tokens', async () => {
      const mockResponse = { data: { success: true, message: 'Registration successful', data: mockAuthResponse } };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.register({
        firstName: 'John',
        email: 'john@example.com',
        password: 'Password@123',
      });

      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('accessToken')).toBe('test-access-token');
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', async () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      localStorage.setItem('user', JSON.stringify(mockAuthResponse.user));

      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await authService.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should clear tokens even if API call fails', async () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');

      (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await authService.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');

      const newAuthResponse = { ...mockAuthResponse, accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
      const mockResponse = { data: { success: true, message: 'Token refreshed', data: newAuthResponse } };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(result.accessToken).toBe('new-access-token');
      expect(localStorage.getItem('accessToken')).toBe('new-access-token');
    });

    it('should throw error when no refresh token exists', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('No refresh token');
    });
  });

  describe('OTP operations', () => {
    it('should send OTP', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await authService.sendOtp('9876543210');

      expect(api.post).toHaveBeenCalledWith('/auth/otp/send', { phone: '9876543210' });
    });

    it('should verify OTP and store tokens', async () => {
      const mockResponse = { data: { success: true, message: 'OTP verified', data: mockAuthResponse } };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.verifyOtp('9876543210', '123456');

      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('accessToken')).toBe('test-access-token');
    });
  });

  describe('forgotPassword', () => {
    it('should initiate forgot password', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await authService.forgotPassword('john@example.com');

      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { emailOrPhone: 'john@example.com' });
    });
  });

  describe('getStoredUser', () => {
    it('should return null when no user in localStorage', () => {
      expect(authService.getStoredUser()).toBeNull();
    });

    it('should return user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockAuthResponse.user));
      const user = authService.getStoredUser();
      expect(user).toEqual(mockAuthResponse.user);
    });

    it('should return null on server side', () => {
      const originalWindow = global.window;
      // @ts-expect-error - deleting window for test
      delete global.window;
      expect(authService.getStoredUser()).toBeNull();
      global.window = originalWindow;
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when token exists', () => {
      localStorage.setItem('accessToken', 'some-token');
      expect(authService.isAuthenticated()).toBe(true);
    });
  });
});
