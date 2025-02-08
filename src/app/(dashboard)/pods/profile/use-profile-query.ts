import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const profileSchema = z.object({
  org_id: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

export async function getProfile(): Promise<Profile> {
  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return profileSchema.parse(data);
}

export default function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 10 * (60 * 1000), // 10 mins
    gcTime: 15 * (60 * 1000), // 15 mins
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  });
}
