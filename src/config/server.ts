import { z } from 'zod';

const envSchema = z.object({
  authURL: z.string().url(),
  anonKey: z.string().min(1),
  backendURL: z.string().url(),
});

export const { authURL, anonKey, backendURL } = envSchema.parse({
  authURL: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY,
  backendURL: process.env.BACKEND_URL,
});
