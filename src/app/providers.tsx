'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

export function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 6 * 1000 * 60 * 60, // 6 hours
        retry: (failureCount, error) => {
          if (error.message === 'Unauthorized') {
            return false;
          };
          return failureCount < 3;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
        }
      },
    }),
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
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TooltipProvider>
  );
}
