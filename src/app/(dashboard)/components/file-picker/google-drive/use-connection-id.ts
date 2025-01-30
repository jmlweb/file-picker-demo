import { useQuery } from "@tanstack/react-query";

import { fetchConnectionId } from "./google-drive-service";

export default function useConnectionId() {
  return useQuery({
    queryKey: ['connectionId'],
    queryFn: fetchConnectionId,
    staleTime: 60000,
  });
}
  