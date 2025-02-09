'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { usePrefetchKbResourcesQuery } from '../../pods/kb/use-kb-resources-query';
import { Loader2 } from 'lucide-react';

export default function Syncing({ kbId }: { kbId: string }) {
  const queryClient = useQueryClient();
  const prefetchKbResources = usePrefetchKbResourcesQuery();
  const [intervalCount, setIntervalCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['kb-resources', kbId] });
      prefetchKbResources(kbId);
      setIntervalCount((prev) => prev + 1);
    }, 1000 * 30);

    return () => clearInterval(interval);
  }, [queryClient, kbId, prefetchKbResources]);

  if (intervalCount >= 4) {
    return null;
  }

  return (
    <div className="mt-2 flex items-center justify-center gap-1 p-2 text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing files
    </div>
  );
}
