import { z } from 'zod';

// Schema definitions
export const connectionIdSchema = z.string().min(1, 'Connection ID is required');

const inodePathSchema = z.object({
  path: z.string().min(1, 'Path is required'),
});

const dataloaderMetadataSchema = z.object({
  created_by: z.string().optional(),
  web_url: z.string().url().optional(),
  path: z.string().optional(),
});

const resourceSchema = z.object({
  knowledge_base_id: z.string().min(1, 'Knowledge base ID is required'),
  resource_id: z.string().min(1, 'Resource ID is required'),
  created_at: z.string().datetime(),
  modified_at: z.string().datetime(),
  indexed_at: z.string().datetime().nullable(),
  inode_type: z.enum(['directory', 'file']),
  content_mime: z.string().optional(),
  inode_path: inodePathSchema,
  dataloader_metadata: dataloaderMetadataSchema,
});

export type Resource = z.infer<typeof resourceSchema>;

export const resourcesSchema = z.array(resourceSchema);