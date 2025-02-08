import { useMutation } from '@tanstack/react-query';
import useConnectionQuery from '../connection/use-connection-query';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function syncKb(orgId: string, kbId: string): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 5000);
  });
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
