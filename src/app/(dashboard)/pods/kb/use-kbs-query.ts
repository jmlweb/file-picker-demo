import { z } from 'zod';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { KbSchema, kbSchema } from './schemas';

const kbsSchema = z.array(kbSchema);

export type Kbs = z.infer<typeof kbsSchema>;

function fetchKbs() {
  try {
    const rawKbs = localStorage.getItem('kbs');
    if (!rawKbs) {
      return [];
    }
    const data = JSON.parse(rawKbs);
    return kbsSchema.parse(data).sort((a, b) => {
      console.log(
        new Date(a.updated_at).getTime(),
        new Date(b.updated_at).getTime(),
      );
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
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
    (kbData?: KbSchema) => {
      if (kbData) {
        queryClient.setQueryData(['kbs'], (old: Kbs) => {
          return [
            ...old,
            {
              knowledge_base_id: kbData.knowledge_base_id,
              name: kbData.name,
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
