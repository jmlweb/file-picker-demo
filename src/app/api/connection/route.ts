import { NextRequest } from 'next/server';
import { backendURL, TOKEN_COOKIE } from '@/config/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider');
  if (!provider) {
    return new Response('Bad Request', { status: 400 });
  }
  const url = new URL(`${backendURL}/connections`);
  url.searchParams.set('connection_provider', provider);
  url.searchParams.set('limit', '1');
  try {
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
      return new Response(response.statusText, { status: response.status });
    }
    const data = await response.json();
    return Response.json({
      connection_id: data[0].connection_id,
      name: data[0].name,
      org_id: data[0].org_id,
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
