import { z } from 'zod';

const BASE_URL = '/integrations-api/google-drive';

const connectionIdSchema = z.string().min(1, 'Connection ID is required');

export const fetchConnectionId = async () => {
  const response = await fetch(`${BASE_URL}/connection-id`);
  if (!response.ok) {
    throw new Error(
      response.statusText === 'UNAUTHORIZED'
        ? response.statusText
        : 'Failed to fetch connection id',
    );
  }
  const data = await response.json();
  return connectionIdSchema.parse(data);
};

const resourceSchema = z.object({
  knowledge_base_id: z.string().min(1, 'Knowledge base ID is required'),
  resource_id: z.string().min(1, 'Resource ID is required'),
  created_at: z.string().datetime(),
  modified_at: z.string().datetime(),
  indexed_at: z.string().datetime().nullable(),
  inode_type: z.enum(['directory', 'file']),
  content_mime: z.string().optional(),
  inode_path: z.object({
    path: z.string().min(1, 'Path is required'),
  }),
  dataloader_metadata: z.object({
    created_by: z.string().optional(),
    web_url: z.string().url().optional(),
    path: z.string().optional(),
  }),
}).passthrough();

const resourcesSchema = z.array(resourceSchema);

export const fetchRootResources = async (connectionId: string) => {
  const searchParams = new URLSearchParams({
    connectionId,
  });
  const url = `${BASE_URL}/resources?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage =
      response.statusText === 'UNAUTHORIZED'
        ? response.statusText
        : 'Failed to fetch root resources';
    throw new Error(errorMessage);
  }
  const data = await response.json();

  return resourcesSchema.parse(data);
};
