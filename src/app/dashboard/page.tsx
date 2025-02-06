import GoogleDriveCard from './components/integrations/google-drive/google-drive-card/google-drive-card';
import IntegrationsDialog from './components/integrations/integrations-dialog/integrations-dialog';
import DashboardProviders from './providers';

export default function Home() {
  return (
    <DashboardProviders>
      <>
        <main className="container mx-auto flex flex-grow items-center justify-center px-4 py-8">
          <GoogleDriveCard kbId={null} />
        </main>
        <IntegrationsDialog />
      </>
    </DashboardProviders>
  );
}
