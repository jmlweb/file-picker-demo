'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePrefetchKbResourcesQuery } from '../../pods/kb/use-kb-resources-query';

export default function Syncing({ kbId }: { kbId: string }) {
  const queryClient = useQueryClient();
  const prefetchKbResources = usePrefetchKbResourcesQuery();
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['kb-resources', kbId] });
      prefetchKbResources(kbId);
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, [queryClient, kbId, prefetchKbResources]);
  return <div>Syncing</div>;
}
