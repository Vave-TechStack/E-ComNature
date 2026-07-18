import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      role?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
  }
}
