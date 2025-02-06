import { z } from 'zod';

import { useQuery } from '@tanstack/react-query';
import { resourcesSchema } from '../resources/schemas';

const kbResourcesSchema = z
  .object({
    data: resourcesSchema,
  })
  .transform(({ data }) => data.filter((resource) => resource.inode_type === 'file'));

const fetchKbResources = async (kbId: string) => {
  const res = await fetch(`/api/kb/${kbId}/resources`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return kbResourcesSchema.parse(data);
};

export default function useKbResourcesQuery(kbId: string) {
  return useQuery({
    queryKey: ['kb-resources', kbId],
    queryFn: () => fetchKbResources(kbId),
  });
}
