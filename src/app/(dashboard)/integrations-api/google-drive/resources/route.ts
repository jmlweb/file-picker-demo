import { backendURL } from '@/config/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const connectionId = request.nextUrl.searchParams.get('connectionId');
  if (!connectionId) {
    return new Response('Bad Request', { status: 400 });
  }
  const url = `${backendURL}/connections/${connectionId}/resources/children`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const data = await response.json();
  return Response.json(data.data);
}
