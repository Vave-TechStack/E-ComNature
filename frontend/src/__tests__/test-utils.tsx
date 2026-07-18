import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/slices/cartSlice';
import authReducer from '@/store/slices/authSlice';
import uiReducer from '@/store/slices/uiSlice';

// Create a fresh store for each test
function createTestStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: {
      cart: { items: [], itemCount: 0, totalAmount: 0, isOpen: false },
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
      ui: {
        theme: 'light' as const,
        isMobileMenuOpen: false,
        isSearchOpen: false,
        isLoading: false,
        activeModal: null,
      },
    },
  });
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  const store = createTestStore();
  const queryClient = createTestQueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={null}>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { createTestStore, createTestQueryClient };
