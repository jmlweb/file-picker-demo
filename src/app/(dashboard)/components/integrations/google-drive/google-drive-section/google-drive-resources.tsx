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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85">
              <Image
                src="/file-types/directory.svg"
                alt={
                  resource.dataloader_metadata.path ?? resource.inode_path.path
                }
                width={20}
                height={20}
                className="size-5"
              />
              <span className="flex-1">{resource.inode_path.path}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Created at: {new Date(resource.created_at).toLocaleString()}</p>
            <p>
              Modified at: {new Date(resource.modified_at).toLocaleString()}
            </p>
          </TooltipContent>
        </Tooltip>
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
  const icon = getResourceIcon(resource.inode_path.path);
  return (
    <div
      className="flex min-h-10 items-center whitespace-nowrap border-t border-muted-foreground/10 py-1"
      style={{ paddingLeft: `${level * 26}px` }}
    >
      <span className="mr-1 h-6 w-6 p-0"></span>
      <Checkbox className="mr-2 border-muted-foreground/40" />
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={resource.dataloader_metadata.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85"
          >
            <Image
              src={`/file-types/${icon}.svg`}
              alt={icon}
              width={20}
              height={20}
            />
            <span className="flex-1">
              {resource.dataloader_metadata.path ?? resource.inode_path.path}
            </span>
            <ExternalLink className="h-4 w-4 text-foreground/50 group-hover:text-current" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Created at: {new Date(resource.created_at).toLocaleString()}</p>
          <p>Modified at: {new Date(resource.modified_at).toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>
      {resource.dataloader_metadata.created_by && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-3 block w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
              {resource.dataloader_metadata.created_by}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{resource.dataloader_metadata.created_by}</p>
          </TooltipContent>
        </Tooltip>
      )}
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
      <div
        className={cn(
          'flex animate-pulse items-center justify-center text-muted-foreground',
          {
            'flex-1': level === 0,
          },
        )}
      >
        Loading...
      </div>
    );
  }

  console.log(data);

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
