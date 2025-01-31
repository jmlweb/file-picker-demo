import { z } from 'zod';

const BASE_URL = '/integrations-api/google-drive';

// Schema definitions
const connectionIdSchema = z.string().min(1, 'Connection ID is required');

const inodePathSchema = z.object({
  path: z.string().min(1, 'Path is required'),
});

const dataloaderMetadataSchema = z.object({
  created_by: z.string().optional(),
  web_url: z.string().url().optional(),
  path: z.string().optional(),
});

const resourceSchema = z
  .object({
    knowledge_base_id: z.string().min(1, 'Knowledge base ID is required'),
    resource_id: z.string().min(1, 'Resource ID is required'),
    created_at: z.string().datetime(),
    modified_at: z.string().datetime(),
    indexed_at: z.string().datetime().nullable(),
    inode_type: z.enum(['directory', 'file']),
    content_mime: z.string().optional(),
    inode_path: inodePathSchema,
    dataloader_metadata: dataloaderMetadataSchema,
  })
  .passthrough();

export type Resource = z.infer<typeof resourceSchema>;

const resourcesSchema = z.array(resourceSchema);

// API error handling
function handleApiError(response: Response, defaultMessage: string): never {
  const errorMessage =
    response.statusText === 'UNAUTHORIZED'
      ? response.statusText
      : defaultMessage;
  throw new Error(errorMessage);
}

// API calls
export async function fetchConnectionId() {
  const response = await fetch(`${BASE_URL}/connection-id`);

  if (!response.ok) {
    handleApiError(response, 'Failed to fetch connection id');
  }

  const data = await response.json();
  return connectionIdSchema.parse(data);
}

export async function fetchResources(connectionId: string, parentId?: string) {
  const searchParams = new URLSearchParams({ connectionId });
  if (parentId) {
    searchParams.set('parent_id', parentId);
  }
  const url = `${BASE_URL}/resources?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    handleApiError(response, 'Failed to fetch root resources');
  }

  const data = await response.json();
  return resourcesSchema.parse(data);
}
