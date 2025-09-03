'use client'; // Mark as client component since it uses browser APIs

import type * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './get-query-client';

// Provider component that sets up React Query for the entire application
// This is a client component because React Query needs access to browser APIs
export default function Providers({ children }: { children: React.ReactNode }) {
  // Get a QueryClient instance that's consistent between server and client
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Development tools for React Query */}
      <div style={{ zIndex: 99999, position: 'fixed', bottom: 15, right: 80 }}>
        <ReactQueryDevtools buttonPosition="relative" initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}
