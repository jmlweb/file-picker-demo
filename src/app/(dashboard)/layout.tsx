import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { TOKEN_COOKIE } from '@/config/server';
import { LogOut } from 'lucide-react';
import { logoutAction } from '../logoutAction';
import UserAvatar from './pods/profile/user-avatar';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE);

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-foreground/5">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">StackAI</h1>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <Button size="sm" onClick={logoutAction}>
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
