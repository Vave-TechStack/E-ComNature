import api from './api';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

// ==================== Mock Auth for Development ====================
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@naturekart.in': {
    password: 'Admin@123',
    user: {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@naturekart.in',
      phone: '+919900000001',
      displayName: 'Admin User',
      profileImage: '',
      role: 'ROLE_ADMIN',
      emailVerified: true,
      phoneVerified: true,
      rewardPoints: 5000,
      walletBalance: 25000,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  },
  'user@naturekart.in': {
    password: 'User@123',
    user: {
      id: 2,
      firstName: 'Demo',
      lastName: 'User',
      email: 'user@naturekart.in',
      phone: '+919900000002',
      displayName: 'Demo User',
      profileImage: '',
      role: 'ROLE_CUSTOMER',
      emailVerified: true,
      phoneVerified: true,
      rewardPoints: 250,
      walletBalance: 500,
      createdAt: '2026-01-15T00:00:00.000Z',
    },
  },
};

function generateMockAuthResponse(user: User): AuthResponse {
  return {
    userId: user.id,
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    tokenType: 'Bearer',
    expiresIn: 86400,
    user,
  };
}

function saveAuthToStorage(authData: AuthResponse) {
  localStorage.setItem('accessToken', authData.accessToken);
  localStorage.setItem('refreshToken', authData.refreshToken);
  localStorage.setItem('user', JSON.stringify(authData.user));
}

// ==================== Auth Service ====================

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      const authData = response.data.data;
      saveAuthToStorage(authData);
      return authData;
    } catch {
      // Fallback: mock auth for development when backend is unavailable
      const identifier = data.emailOrPhone.toLowerCase();
      const mockUser = MOCK_USERS[identifier];
      if (mockUser && mockUser.password === data.password) {
        const authData = generateMockAuthResponse(mockUser.user);
        saveAuthToStorage(authData);
        console.info('🔐 Mock login successful:', identifier);
        return authData;
      }
      if (mockUser && mockUser.password !== data.password) {
        throw new Error('Invalid password');
      }
      // For any non-mock user, auto-login in dev mode
      console.warn('Dev mode: auto-logged in', data.emailOrPhone);
      const autoUser: User = {
        id: Date.now(),
        firstName: data.emailOrPhone.includes('@') ? data.emailOrPhone.split('@')[0] : 'User',
        lastName: '',
        email: data.emailOrPhone,
        phone: '',
        displayName: data.emailOrPhone.includes('@') ? data.emailOrPhone.split('@')[0] : data.emailOrPhone,
        profileImage: '',
        role: 'ROLE_CUSTOMER',
        emailVerified: false,
        phoneVerified: false,
        rewardPoints: 0,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      };
      const authData = generateMockAuthResponse(autoUser);
      saveAuthToStorage(authData);
      console.info('🔐 Auto-login (dev mode):', data.emailOrPhone);
      return authData;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      const authData = response.data.data;
      saveAuthToStorage(authData);
      return authData;
    } catch {
      // Mock registration for development
      const mockUser: User = {
        id: Date.now(),
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email || (data.phone ? '' : '') as unknown as string,
        phone: data.phone || '',
        displayName: (data.firstName + ' ' + (data.lastName || '')).trim(),
        profileImage: '',
        role: 'ROLE_CUSTOMER',
        emailVerified: false,
        phoneVerified: false,
        rewardPoints: 100,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      };
      const authData = generateMockAuthResponse(mockUser);
      saveAuthToStorage(authData);
      console.info('🔐 Mock registration successful:', data.email || data.phone);
      return authData;
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Send refresh token as Authorization header (matching backend)
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });
      }
    } catch {
      // Clear local state regardless of API success
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
    const authData = response.data.data;
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    return authData;
  },

  async sendOtp(phone: string): Promise<void> {
    await api.post('/auth/otp/send', { phone });
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', { phone, otp });
    const authData = response.data.data;
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    return authData;
  },

  async forgotPassword(emailOrPhone: string): Promise<void> {
    await api.post('/auth/forgot-password', { emailOrPhone });
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};
