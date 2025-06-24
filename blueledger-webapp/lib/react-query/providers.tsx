'use client'; // Mark as client component since it uses browser APIs

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './get-query-client';
import type * as React from 'react';

// Provider component that sets up React Query for the entire application
// This is a client component because React Query needs access to browser APIs
export default function Providers({ children }: { children: React.ReactNode }) {
  // Get a QueryClient instance that's consistent between server and client
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Development tools for React Query */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
