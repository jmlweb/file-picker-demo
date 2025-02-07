import { backendURL, TOKEN_COOKIE } from '@/config/server';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  connection_id: z.string(),
  connection_source_ids: z.array(z.string()),
  name: z.string(),
  description: z.string(),
});

const extractBody = (rawBody: unknown) => {
  try {
    return bodySchema.parse(rawBody);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const rawBody = await request.json();
  const body = extractBody(rawBody);
  if (!body) {
    return new Response('Bad Request', { status: 400 });
  }

  const response = await fetch(`${backendURL}/knowledge_bases`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      ...body,
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: 'text-embedding-ada-002',
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: 'sentence',
        },
      },
      org_level_role: null,
      cron_job_id: null,
    }),
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
    console.error(response.statusText);
    return new Response(response.statusText, { status: response.status });
  }
  const data = await response.json();
  return Response.json(data);
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const knowledgeBaseId = request.nextUrl.searchParams.get('knowledgeBaseId');
  if (!knowledgeBaseId) {
    return new Response('Bad Request', { status: 400 });
  }
  const url = new URL(
    `${backendURL}/knowledge_bases/${knowledgeBaseId}/resources/children`,
  );
  url.searchParams.set('resource_path', '/');
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
