import { NextRequest } from 'next/server';
import { backendURL, TOKEN_COOKIE } from '@/config/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const knowledgeBaseId = (await params).id;
  const url = new URL(
    `${backendURL}/knowledge_bases/${knowledgeBaseId}/resources/children`,
  );
  const resourcePath = request.nextUrl.searchParams.get('resource_path') ?? '/';
  url.searchParams.set('resource_path', resourcePath);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return new Response(response.statusText, { status: response.status });
  }
  const data = await response.json();
  return Response.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const knowledgeBaseId = (await params).id;
  const resourcePath = request.nextUrl.searchParams.get('resource_path');
  if (!resourcePath) {
    return new Response('Bad Request', { status: 400 });
  }
  const url = new URL(
    `${backendURL}/knowledge_bases/${knowledgeBaseId}/resources`,
  );
  url.searchParams.set('resource_path', resourcePath);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return new Response(response.statusText, { status: response.status });
  }
  return new Response('OK', { status: 200 });
}
