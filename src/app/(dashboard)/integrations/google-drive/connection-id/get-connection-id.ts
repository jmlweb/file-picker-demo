
import { z } from 'zod';
import { backendURL } from '@/config/server';

const connectionIdSchema = z.array(
  z.object({
    connection_id: z.string().min(1),
  }),
).transform((data) => data[0].connection_id);

export default async function getConnectionId(token: string) {
  const response = await fetch(
    `${backendURL}/connections?connection_provider=gdrive&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'UNAUTHORIZED' : response.statusText);
  }
  const data = await response.json();
  const connectionId = connectionIdSchema.parse(data);
  return connectionId;
}