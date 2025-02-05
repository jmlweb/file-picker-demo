import { useQuery } from '@tanstack/react-query';
import { getProfile } from './profile-service';

export default function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });
}
