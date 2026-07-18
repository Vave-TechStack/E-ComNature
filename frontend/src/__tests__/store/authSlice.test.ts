import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, {
  setUser,
  clearError,
  login,
  register,
  logout,
} from '@/store/slices/authSlice';
import type { User } from '@/types';

// Mock authService
vi.mock('@/services/auth', () => ({
  authService: {
    getStoredUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockUser: User = {
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
  rewardPoints: 50,
  walletBalance: 100,
};

const requestId = 'test-request-id';

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('setUser (reducer)', () => {
    it('should set user and mark as authenticated', () => {
      const state = reducer(undefined, setUser(mockUser));

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('clearError (reducer)', () => {
    it('should clear the error state', () => {
      // Start from rejected state which sets the error
      const rejectedAction = login.rejected(
        new Error('Some error'),
        requestId,
        { emailOrPhone: 'test@test.com', password: 'pass' },
        'Some error'
      );
      const stateWithError = reducer(undefined, rejectedAction);
      expect(stateWithError.error).toBe('Some error');

      const clearedState = reducer(stateWithError, clearError());
      expect(clearedState.error).toBeNull();
    });
  });

  describe('login (async thunk)', () => {
    it('should handle login.fulfilled', () => {
      // Create the fulfilled action manually
      const fulfilledAction = login.fulfilled(
        mockUser,
        requestId,
        { emailOrPhone: 'john@example.com', password: 'Password@123' }
      );
      const state = reducer(undefined, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login.pending', () => {
      const pendingAction = login.pending(
        requestId,
        { emailOrPhone: 'john@example.com', password: 'Password@123' }
      );
      const state = reducer(undefined, pendingAction);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login.rejected', () => {
      const rejectedAction = login.rejected(
        new Error('Invalid credentials'),
        requestId,
        { emailOrPhone: 'john@example.com', password: 'wrong' },
        'Invalid credentials'
      );
      const state = reducer(undefined, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('register (async thunk)', () => {
    it('should handle register.fulfilled', () => {
      const fulfilledAction = register.fulfilled(
        mockUser,
        requestId,
        { firstName: 'John', email: 'john@example.com', password: 'Password@123' }
      );
      const state = reducer(undefined, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle register.pending', () => {
      const pendingAction = register.pending(
        requestId,
        { firstName: 'John', email: 'john@example.com', password: 'Password@123' }
      );
      const state = reducer(undefined, pendingAction);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle register.rejected', () => {
      const rejectedAction = register.rejected(
        new Error('Email already exists'),
        requestId,
        { firstName: 'John', email: 'john@example.com', password: 'Password@123' },
        'Email already exists'
      );
      const state = reducer(undefined, rejectedAction);

      expect(state.error).toBe('Email already exists');
    });
  });

  describe('logout (async thunk)', () => {
    it('should handle logout.fulfilled', () => {
      const loggedInState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

      const fulfilledAction = logout.fulfilled(
        undefined,
        requestId
      );
      const state = reducer(loggedInState, fulfilledAction);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
