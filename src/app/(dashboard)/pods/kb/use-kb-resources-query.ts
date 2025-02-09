import { z } from 'zod';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { resourcesSchema } from '../resources/schemas';

const kbResourcesSchema = z
  .object({
    data: resourcesSchema,
  })
  .transform(({ data }) => data);

export type KbResources = z.infer<typeof kbResourcesSchema>;

const fetchKbResources = async (kbId: string, parentPath: string) => {
  const res = await fetch(
    `/api/kb/${kbId}/resources?resource_path=${parentPath}`,
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return kbResourcesSchema.parse(data);
};

export default function useKbResourcesQuery(kbId: string, parentPath = '/') {
  return useQuery({
    queryKey: ['kb-resources', kbId, parentPath],
    queryFn: () => fetchKbResources(kbId, parentPath),
  });
}

export function usePrefetchKbResourcesQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    (kbId: string, parentPath = '/') => {
      queryClient.prefetchQuery({
        queryKey: ['kb-resources', kbId, parentPath],
        queryFn: () => fetchKbResources(kbId, parentPath),
      });
    },
    [queryClient],
  );
}
