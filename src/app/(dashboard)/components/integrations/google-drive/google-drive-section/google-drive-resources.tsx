import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useResources from '../use-resources';
import { AlertCircle, ExternalLink } from 'lucide-react';
import type { Resource } from '../google-drive-service';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
const getResourceIcon = (fileName: string) => {
  const extension = fileName?.split('.').pop();
  if (extension) {
    return ['mp4'].includes(extension) ? 'video' : extension;
  }
  return 'file';
};

function Directory({ level, resource }: { level: number; resource: Resource }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="group flex min-h-10 items-center border-t border-muted-foreground/20 py-1 hover:bg-muted/50"
        style={{
          paddingLeft: `${level * 26}px`,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 h-6 w-6 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform', {
              'rotate-90 transform': isOpen,
            })}
          />
        </Button>
        <Checkbox className="mr-2 border-muted-foreground/40" />
        <div className="group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85">
          <Image
            src="/file-types/directory.svg"
            alt={resource.dataloader_metadata.path ?? resource.inode_path.path}
            width={20}
            height={20}
            className="size-5"
          />
          <span className="flex-1">{resource.inode_path.path}</span>
        </div>
      </div>
      {isOpen && (
        <GoogleDriveResources
          parentId={resource.resource_id}
          level={level + 1}
        />
      )}
    </>
  );
}

function File({ level, resource }: { level: number; resource: Resource }) {
  return (
    <div
      className="flex min-h-10 items-center border-t border-muted-foreground/10 py-1"
      style={{ paddingLeft: `${level * 26}px` }}
    >
      <span className="mr-1 h-6 w-6 p-0"></span>
      <Checkbox className="mr-2 border-muted-foreground/40" />
      <a
        href={resource.dataloader_metadata.path}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85"
      >
        <Image
          src={`/file-types/${getResourceIcon(resource.inode_path.path)}.svg`}
          alt={resource.dataloader_metadata.path ?? resource.inode_path.path}
          width={20}
          height={20}
        />
        <span className="flex-1">{resource.inode_path.path}</span>
        <ExternalLink className="h-4 w-4 text-foreground/50 group-hover:text-current" />
      </a>
    </div>
  );
}

export function GoogleDriveResources({
  parentId,
  level = 0,
}: {
  parentId?: string;
  level?: number;
}) {
  const { data, error } = useResources(parentId);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (data == null) {
    return (
      <div className={cn('flex items-center justify-center text-muted-foreground animate-pulse', {
        'flex-1': level === 0,
      })}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {data.map((resource) =>
        resource.inode_type === 'directory' ? (
          <Directory
            key={resource.resource_id}
            level={level}
            resource={resource}
          />
        ) : (
          <File key={resource.resource_id} level={level} resource={resource} />
        ),
      )}
    </>
  );
}
