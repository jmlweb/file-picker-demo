import { backendURL, TOKEN_COOKIE } from '@/config/server';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const connectionId = (await params).id;
  const parentId = request.nextUrl.searchParams.get('parent_id');
  const url = new URL(
    `${backendURL}/connections/${connectionId}/resources/children`,
  );

  if (parentId) {
    url.searchParams.set('resource_id', parentId);
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return new Response(response.statusText, { status: response.status });
  }
  const data = await response.json();
  return Response.json(data.data);
}
