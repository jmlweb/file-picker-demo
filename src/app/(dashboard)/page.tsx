import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FilePickerDialog from './components/file-picker/file-picker-dialog';
import GoogleDriveButton from './components/file-picker/google-drive/google-drive-button';

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
            <GoogleDriveButton />
          </CardContent>
        </Card>
      </main>
      <FilePickerDialog />
    </>
  );
}
