import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FilePickerDialog from './components/file-picker/file-picker-dialog';
import FilePickerButton from './components/file-picker/file-picker-button';
import { INTEGRATION_NAMES } from './config';

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
            <FilePickerButton
              integrationName={INTEGRATION_NAMES['google-drive']}
            >
              Pick files from Google Drive
            </FilePickerButton>
          </CardContent>
        </Card>
      </main>
      <FilePickerDialog />
    </>
  );
}
