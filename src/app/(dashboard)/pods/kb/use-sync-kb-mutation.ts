import { useMutation } from '@tanstack/react-query';
import useConnectionQuery from '../connection/use-connection-query';

async function syncKb(orgId: string, kbId: string) {
  const response = await fetch(`/api/kb/${kbId}/sync?orgId=${orgId}`);
  if (!response.ok) {
    throw new Error('Failed to sync knowledge base');
  }
  return response.text();
}

export default function useSyncKbMutation(provider: 'gdrive') {
  const { data: connectionData } = useConnectionQuery(provider);
  const orgId = connectionData?.org_id;
  return useMutation({
    mutationFn: (kbId: string) => {
      if (!orgId) {
        throw new Error('Connection id not found');
      }
      return syncKb(orgId, kbId);
    },
  });
}
