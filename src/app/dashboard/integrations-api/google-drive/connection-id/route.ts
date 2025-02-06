import { NextRequest } from 'next/server';
import getConnectionId from './get-connection-id';
import { TOKEN_COOKIE } from '@/config/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const connectionId = await getConnectionId(token);
    return Response.json(connectionId);
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
