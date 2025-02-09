import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import useKbResourcesQuery from '../../pods/kb/use-kb-resources-query';

import Syncing from './syncing';
import FileExplorer from './file-explorer';

export default function KbResources({ kbId }: { kbId: string }) {
  const { data, error } = useKbResourcesQuery(kbId);
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <>
      <div className="mt-4 flex flex-col text-sm">
        <div className="flex h-9 items-center gap-2 rounded-t-lg border border-border bg-background p-1 text-sm font-medium">
          <div className="flex flex-grow items-center gap-2">
            <div className="w-[44px]"></div>
            <p className="pl-1">Name</p>
          </div>
          <p className="w-20">Size</p>
          <p className="w-16 text-center">Status</p>
          <p className="w-10"></p>
        </div>
        <FileExplorer kbId={kbId} />
      </div>
      {data && data.length === 0 && <Syncing kbId={kbId} />}
    </>
  );
}
