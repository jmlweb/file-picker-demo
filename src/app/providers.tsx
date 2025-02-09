'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  isServer,
} from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30, // 30 seconds
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error) => {
          if (error.message === 'Unauthorized') {
            return false;
          }
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
  if (!isServer) {
    const persister = createSyncStoragePersister({
      storage: window.sessionStorage,
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 10, // 10 minutes
      buster: process.env.NEXT_PUBLIC_APP_VERSION, // Optional cache buster
    });
  }

  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TooltipProvider>
  );
}
