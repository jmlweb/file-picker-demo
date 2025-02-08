import { NextRequest } from 'next/server';
import { backendURL, TOKEN_COOKIE } from '@/config/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const response = await fetch(`${backendURL}/organizations/me/current`, {
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
      org_id: data.org_id,
      org_name: data.org_name,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
