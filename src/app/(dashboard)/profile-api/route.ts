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
      throw new Error(
        response.status === 401 ? 'UNAUTHORIZED' : response.statusText,
      );
    }
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'Set-Cookie': `token=; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
        },
      });
    }
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
