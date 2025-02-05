import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import GoogleDriveTrigger from './components/integrations/google-drive/google-drive-trigger';
import IntegrationsDialog from './components/integrations/integrations-dialog/integrations-dialog';
import DashboardProviders from './providers';

export default async function Home() {
  return (
    <DashboardProviders>
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
              <GoogleDriveTrigger />
            </CardContent>
          </Card>
        </main>
        <IntegrationsDialog />
      </>
    </DashboardProviders>
  );
}
