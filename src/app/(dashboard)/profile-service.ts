import { z } from 'zod';

const profileSchema = z.object({
  organization_id: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

export async function getProfile(): Promise<Profile> {
  const response = await fetch('/profile-api');
  if (!response.ok) {
    throw new Error(
      response.statusText === 'UNAUTHORIZED'
        ? response.statusText
        : 'Internal Server Error',
    );
  }
  const data = await response.json();
  return profileSchema.parse(data);
}
