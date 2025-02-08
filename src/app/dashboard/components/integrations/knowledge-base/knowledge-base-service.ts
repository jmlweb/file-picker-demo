import { z } from 'zod';

import { resourcesSchema } from '../schemas';

const kbSchema = z.object({
  knowledge_base_id: z.string(),
  name: z.string(),
  description: z.string().datetime(),
  created_at: z.string().datetime(),
});

export type KbSchema = z.infer<typeof kbSchema>;

export async function createKb(
  connectionId: string,
  selectedItems: string[],
): Promise<KbSchema> {
  const response = await fetch('/integrations-api/knowledge-database', {
    method: 'POST',
    body: JSON.stringify({
      connection_id: connectionId,
      connection_source_ids: selectedItems,
      name: 'Test Knowledge Base',
      description: 'This is a test knowledge base',
    }),
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

const kbResourcesSchema = z
  .object({
    data: resourcesSchema,
  })
  .transform(({ data }) => data);

export async function getKbResources(kbId: string) {
  const response = await fetch(
    `/integrations-api/knowledge-database?knowledgeBaseId=${kbId}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }
  const data = await response.json();
  return kbResourcesSchema.parse(data);
}
