import { z } from 'zod';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const kbsSchema = z.array(
  z.object({
    knowledge_base_id: z.string(),
    name: z.string(),
    description: z.string(),
    updated_at: z.string(),
  }),
);

export type Kbs = z.infer<typeof kbsSchema>;

async function fetchKbs() {
  try {
    await fetch('/');
    const rawKbs = localStorage.getItem('kbs');
    if (!rawKbs) {
      return [];
    }
    const data = JSON.parse(rawKbs);
    return kbsSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    localStorage.removeItem('kbs');
    return [];
  }
}

export default function useKbsQuery() {
  return useQuery({
    queryKey: ['kbs'],
    queryFn: () => fetchKbs(),
  });
}

export function useRefreshKbsQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    (kbData?: {
      knowledge_base_id: string;
      name: string;
      description: string;
      updated_at: string;
    }) => {
      if (kbData) {
        queryClient.setQueryData(['kbs'], (old: Kbs) => {
          return [
            ...old,
            {
              knowledge_base_id: kbData.knowledge_base_id,
              name: kbData.name,
              description: kbData.description,
              updated_at: kbData.updated_at,
            },
          ];
        });
      }
      queryClient.invalidateQueries({ queryKey: ['kbs'] });
    },
    [queryClient],
  );
}
