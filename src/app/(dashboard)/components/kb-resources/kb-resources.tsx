import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useKbResources from '../../pods/kb/use-kb-resources';
import { AlertCircle, Trash } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined) return '-';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  const size = (bytes / Math.pow(1024, exponent)).toFixed(2);
  
  return `${size} ${units[exponent]}`;
}

export default function KbResources({ kbId }: { kbId: string }) {
  const { data, error } = useKbResources(kbId);
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  if (!data) {
    return <div>Loading...</div>;
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
            <TableCell className="text-right">{formatFileSize(resource.size)}</TableCell>
            <TableCell className="text-center">{resource.status}</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={cn('-m-1 mr-1 h-6 w-6 text-muted-foreground', {
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
