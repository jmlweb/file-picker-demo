import { z } from 'zod';

import { useQuery } from '@tanstack/react-query';

const kbsSchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    description: z.string(),
    updated_at: z.string(),
  }),
);

export type Kbs = z.infer<typeof kbsSchema>;

function fetchKbs() {
  try {
    const rawKbs = localStorage.getItem('kbs');
    if (!rawKbs) {
      return {};
    }
    const data = JSON.parse(rawKbs);
    return kbsSchema.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {};
  }
}

function getKbs(): Promise<Kbs> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetchKbs());
    }, 1000);
  });
}

export default function useKbs() {
  return useQuery({
    queryKey: ['kbs'],
    queryFn: getKbs,
  });
}
