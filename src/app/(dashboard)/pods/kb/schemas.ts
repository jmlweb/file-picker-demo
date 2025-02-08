import { z } from 'zod';

export const kbSchema = z.object({
  knowledge_base_id: z.string(),
  name: z.string(),
  updated_at: z.string().datetime(),
});

export type KbSchema = z.infer<typeof kbSchema>;
