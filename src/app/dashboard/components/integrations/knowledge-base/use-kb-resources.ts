import { useQuery } from '@tanstack/react-query';
import { getKbResources } from './knowledge-base-service';

export default function useKbResources(kbId: string | null) {
  return useQuery({
    queryKey: ['kb-resources', kbId],
    queryFn: () => {
      if (!kbId) {
        return [];
      }
      return getKbResources(kbId);
    },
  });
}
