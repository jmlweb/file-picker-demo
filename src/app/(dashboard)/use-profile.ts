import { useQuery } from '@tanstack/react-query';
import { getProfile } from './profile-service';

export default function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 10 * (60 * 1000), // 10 mins
    gcTime: 15 * (60 * 1000), // 15 mins
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });
}
