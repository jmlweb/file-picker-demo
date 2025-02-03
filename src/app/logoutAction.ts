'use server';

import { TOKEN_COOKIE } from '@/config/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  redirect('/login');
}
