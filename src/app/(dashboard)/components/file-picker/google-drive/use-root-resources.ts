import { useQuery } from '@tanstack/react-query';
import { fetchRootResources } from './google-drive-service';
import useConnectionId from './use-connection-id';

export default function useRootResources() {
  const { data: connectionId } = useConnectionId();

  return useQuery({
    queryKey: ['rootResources', connectionId],
    queryFn: () => {
      if (!connectionId) {
        throw new Error('Connection ID is required');
      }
      return fetchRootResources(connectionId);
    },
    enabled: !!connectionId,
    staleTime: 30000,
  });
}
