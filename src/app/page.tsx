import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import FilePickerDialog from '@/components/file-picker-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogOut } from 'lucide-react';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/login');
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-foreground/5">
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <h1 className="text-2xl font-bold">StackAI</h1>
            <div className="flex items-center gap-4">
              <Avatar className="size-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button variant="outline">
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-grow px-4 py-8 flex justify-center items-center">
          <Card className="mx-auto max-w-md w-full">
            <CardHeader>
              <CardTitle>Google Drive</CardTitle>
              <CardDescription>
                Select files from your Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Pick files from Google Drive</Button>
            </CardContent>
          </Card>
        </main>
      </div>
      <FilePickerDialog />
    </>
  );
}
