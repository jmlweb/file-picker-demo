import { z } from 'zod';

const kbSchema = z
  .object({
    knowledge_base_id: z.string(),
  })
  .transform((data) => data.knowledge_base_id);

export type KbId = z.infer<typeof kbSchema>;

export async function createKb(
  connectionId: string,
  selectedItems: string[],
): Promise<KbId> {
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
