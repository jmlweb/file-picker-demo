import { z } from 'zod';

import { useQuery } from '@tanstack/react-query';

const connectionSchema = z.object({
  connection_id: z.string(),
  org_id: z.string(),
  name: z.string(),
});

async function fetchConnection(provider: string) {
  const url = new URL('/api/connection', window.location.origin);
  url.searchParams.set('provider', provider);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return connectionSchema.parse(await response.json());
}

export default function useConnectionQuery(provider: string) {
  return useQuery({
    queryKey: ['connection', provider],
    queryFn: () => fetchConnection(provider),
    staleTime: 5 * 60 * 1000,
  });
}
