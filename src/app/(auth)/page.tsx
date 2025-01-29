
import FilePickerDialog from '@/components/file-picker-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function Home() {

  return (
    <>
      <main className="container mx-auto flex flex-grow items-center justify-center px-4 py-8">
        <Card className="mx-auto w-full max-w-md">
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
      <FilePickerDialog />
    </>
  );
}
