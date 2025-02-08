import useConnectionQuery from '../connection/use-connection-query';
import { useMutation } from '@tanstack/react-query';
import { kbSchema, KbSchema } from './schemas';

type Payload = {
  connection_id: string;
  name: string;
  description: string;
  connection_source_ids: string[];
};

export async function createKb(payload: Payload): Promise<KbSchema> {
  const response = await fetch('/api/kb', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(
      response.statusText === 'UNAUTHORIZED'
        ? response.statusText
        : 'Internal Server Error',
    );
  }
  const data = await response.json();
  return kbSchema.parse(data);
}

export default function useCreateKbMutation(provider: 'gdrive') {
  const { data: connectionData } = useConnectionQuery(provider);
  const connectionId = connectionData?.connection_id;
  return useMutation({
    mutationFn: (payload: Omit<Payload, 'connection_id'>) => {
      if (!connectionId) {
        throw new Error('Connection id not found');
      }
      return createKb({
        ...payload,
        connection_id: connectionId,
      });
    },
    onSuccess: (data) => {
      const rawKbs = localStorage.getItem('kbs');
      const newData = {
        knowledge_base_id: data.knowledge_base_id,
        name: data.name,
        updated_at: data.updated_at,
      };
      if (!rawKbs) {
        localStorage.setItem('kbs', JSON.stringify([newData]));
      } else {
        localStorage.setItem(
          'kbs',
          JSON.stringify([...JSON.parse(rawKbs), newData]),
        );
      }
    },
  });
}
