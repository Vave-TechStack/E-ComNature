'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { PageCategoryProvider } from '@/lib/contexts/PageCategoryContext';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { authService } from '@/services/auth';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <AuthInitializer>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <PageCategoryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#342F28',
                    color: '#F3F1EB',
                    borderRadius: '14px',
                    border: '1px solid rgba(61, 122, 61, 0.15)',
                    boxShadow: '0 10px 30px -8px rgba(31, 28, 23, 0.25), 0 4px 6px -4px rgba(31, 28, 23, 0.1)',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    padding: '12px 16px',
                    maxWidth: '420px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#2D5F2D',
                      secondary: '#F0F5F0',
                    },
                    style: {
                      borderLeft: '3px solid #3D7A3D',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#C53030',
                      secondary: '#FFF5F5',
                    },
                    style: {
                      borderLeft: '3px solid #E53E3E',
                    },
                  },
                  loading: {
                    iconTheme: {
                      primary: '#C9990E',
                      secondary: '#FDF8E8',
                    },
                    style: {
                      borderLeft: '3px solid #E5B81F',
                    },
                  },
                }}
              />
            </PageCategoryProvider>
          </SessionProvider>
        </QueryClientProvider>
      </AuthInitializer>
    </ReduxProvider>
  );
}

