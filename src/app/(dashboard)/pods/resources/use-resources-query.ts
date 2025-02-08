import { useQuery } from '@tanstack/react-query';
import { resourcesSchema } from './schemas';
import useConnectionQuery from '../connection/use-connection-query';

const fetchResources = async (connectionId: string, parentId?: string) => {
  const url = new URL(
    `/api/connection/${connectionId}/resources`,
    window.location.origin,
  );
  if (parentId) {
    url.searchParams.set('parent_id', parentId);
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return resourcesSchema.parse(data);
};

export default function useResourcesQuery(
  provider: 'gdrive',
  parentId?: string,
) {
  const { data: connectionData } = useConnectionQuery(provider);
  const connectionId = connectionData?.connection_id;
  return useQuery({
    queryKey: ['resources', connectionId, parentId],
    queryFn: () => {
      if (!connectionId) {
        throw new Error('Connection id not found');
      }
      return fetchResources(connectionId, parentId);
    },
    enabled: !!connectionId,
  });
}
