const BASE_URL = '/integrations-api/google-drive';

import {
  connectionIdSchema,
  resourcesSchema,
} from '@/app/dashboard/components/integrations/schemas';

// API error handling
function handleApiError(response: Response, defaultMessage: string): never {
  const errorMessage =
    response.statusText === 'UNAUTHORIZED'
      ? response.statusText
      : defaultMessage;
  throw new Error(errorMessage);
}

// API calls
export async function fetchConnectionId() {
  const response = await fetch(`${BASE_URL}/connection-id`);

  if (!response.ok) {
    handleApiError(response, 'Failed to fetch connection id');
  }

  const data = await response.json();
  return connectionIdSchema.parse(data);
}

export async function fetchResources(connectionId: string, parentId?: string) {
  const searchParams = new URLSearchParams({ connectionId });
  if (parentId) {
    searchParams.set('parent_id', parentId);
  }
  const url = `${BASE_URL}/resources?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    handleApiError(response, 'Failed to fetch root resources');
  }

  const data = await response.json();
  console.log(data);
  return resourcesSchema.parse(data);
}
