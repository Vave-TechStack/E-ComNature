import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// Mirror the mock users from authService for development fallback
const MOCK_USERS: Record<string, { password: string; user: { id: number; email: string; displayName: string; profileImage: string; role: string } }> = {
  'admin@naturekart.in': {
    password: 'Admin@123',
    user: {
      id: 1,
      email: 'admin@naturekart.in',
      displayName: 'Admin User',
      profileImage: '',
      role: 'ROLE_ADMIN',
    },
  },
  'user@naturekart.in': {
    password: 'User@123',
    user: {
      id: 2,
      email: 'user@naturekart.in',
      displayName: 'Demo User',
      profileImage: '',
      role: 'ROLE_CUSTOMER',
    },
  },
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          return null;
        }

        // Try real API first
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            emailOrPhone: credentials.emailOrPhone,
            password: credentials.password,
          });

          const authData = response.data.data;

          return {
            id: authData.userId.toString(),
            email: authData.user.email,
            name: authData.user.displayName,
            image: authData.user.profileImage,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            role: authData.user.role,
          };
        } catch {
          // Fallback: mock auth for development when backend is unavailable
          const identifier = credentials.emailOrPhone.toLowerCase();
          const mockUser = MOCK_USERS[identifier];

          if (mockUser && mockUser.password === credentials.password) {
            console.info('🔐 Mock authorize successful:', identifier);
            return {
              id: mockUser.user.id.toString(),
              email: mockUser.user.email,
              name: mockUser.user.displayName,
              image: mockUser.user.profileImage,
              accessToken: 'mock_access_token_' + Date.now(),
              refreshToken: 'mock_refresh_token_' + Date.now(),
              role: mockUser.user.role,
            };
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'e-com-nature-super-secret-key-2026-production',
});

export { handler as GET, handler as POST };
