import useKbResourcesQuery from '../../pods/kb/use-kb-resources-query';

import { AlertError } from '../alert-error/alert-error';
import FileExplorer from './file-explorer';
import Syncing from './syncing';

export default function KbResources({ kbId }: { kbId: string }) {
  const { data, error } = useKbResourcesQuery(kbId);
  if (error) {
    return <AlertError message={error.message} />;
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
