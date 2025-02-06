import { useQuery } from '@tanstack/react-query';

async function fetchConnection(provider: string) {
  const url = new URL('/api/connection', window.location.origin);
  url.searchParams.set('provider', provider);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useConnectionQuery(provider: string) {
  return useQuery({
    queryKey: ['connection', provider],
    queryFn: () => fetchConnection(provider),
    staleTime: 5 * 60 * 1000,
  });
}
