import mock from '@/mocks/createKnowledgeDB.json';
import useConnectionQuery from '../connection/use-connection-query';
import { useMutation } from '@tanstack/react-query';

type Payload = {
  connection_id: string;
  name: string;
  description: string;
  connection_source_ids: string[];
};

function createKb(payload: Payload): Promise<typeof mock> {
  return new Promise((resolve) => {
    console.log(payload);
    setTimeout(() => {
      console.log(mock);
      resolve(mock);
    }, 1000);
  });
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
        description: data.description,
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
