'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';

export function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 6 * 1000 * 60 * 60, // 6 hours
      },
    },
  });

  // Only run persister in browser environment
  if (typeof window !== 'undefined') {
    const persister = createSyncStoragePersister({
      storage: window.sessionStorage,
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: 6 * 1000 * 60 * 60, // 6 hours
      buster: process.env.NEXT_PUBLIC_APP_VERSION, // Optional cache buster
    });
  }

  return queryClient;
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
