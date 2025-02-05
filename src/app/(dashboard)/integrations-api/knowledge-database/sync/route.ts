import { backendURL, TOKEN_COOKIE } from '@/config/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const knowledgeBaseId = request.nextUrl.searchParams.get('knowledgeBaseId');
  const orgId = request.nextUrl.searchParams.get('orgId');
  if (!knowledgeBaseId || !orgId) {
    return new Response('Bad Request', { status: 400 });
  }
  const response = await fetch(
    `${backendURL}/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'Set-Cookie': `token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
        },
      });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
  return new Response(await response.text());
}
