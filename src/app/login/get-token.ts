import { z } from 'zod';

import { authURL, anonKey } from '@/config/server';

// TODO: Add refresh_token and expires_in
const accessTokenSchema = z
  .object({
    access_token: z.string().min(1),
  })
  .transform((data) => data.access_token);

export default async function getToken(email: string, password: string) {
  const response = await fetch(`${authURL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
    headers: {
      'Content-Type': 'application/json',
      Apikey: anonKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get token. Status: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return accessTokenSchema.parse(data);
}
