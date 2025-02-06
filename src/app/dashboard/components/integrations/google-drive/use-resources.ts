import { useQuery } from '@tanstack/react-query';
import { fetchResources } from './google-drive-service';
import useConnectionId from './use-connection-id';

export default function useResources(parentId?: string) {
  const { data: connectionId } = useConnectionId();

  return useQuery({
    queryKey: ['resources', connectionId, parentId ?? ''],
    queryFn: () => {
      if (!connectionId) {
        throw new Error('Connection ID is required');
      }
      return fetchResources(connectionId, parentId);
    },
    enabled: !!connectionId,
    staleTime: 30 * 1000,
  });
}
