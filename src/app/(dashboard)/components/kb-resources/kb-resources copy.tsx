import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trash } from 'lucide-react';
import useKbResourcesQuery from '../../pods/kb/use-kb-resources-query';

import { formatFileSize } from '@/app/(dashboard)/pods/resources/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Syncing from './syncing';

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
  if (!data || data.length === 0) {
    return (
      <>
        <div>Loading...</div>
        {data && data.length > 0 && <Syncing kbId={kbId} />}
      </>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((resource) => (
          <TableRow key={resource.resource_id}>
            <TableCell>{resource.dataloader_metadata.path}</TableCell>
            <TableCell className="text-right">
              {formatFileSize(resource.size)}
            </TableCell>
            <TableCell className="text-center">{resource.status}</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={clsx('-m-1 mr-1 h-6 w-6 text-muted-foreground', {
                      'opacity-50': false,
                    })}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    Remove from knowledge base: {resource.knowledge_base_id}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
