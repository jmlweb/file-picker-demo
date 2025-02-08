import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { AlertCircle, ChevronRight, ExternalLink, Trash } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { fetchResources, type Resource } from '../google-drive-service';
import useConnectionId from '../use-connection-id';
import useResources from '../use-resources';
import { useAllSelectedStore, useUncheckStore } from './store';

const DEFAULT_KNOWLEDGE_ID = '00000000-0000-0000-0000-000000000000';

const extractFileName = (path: string) => path.split('/').pop() ?? path;

const resourceRowVariants = cva(
  'flex min-h-10 items-center whitespace-nowrap py-1',
  {
    variants: {
      variant: {
        directory: 'border-t border-muted-foreground/20 hover:bg-muted/50',
        file: 'border-t border-muted-foreground/10',
      },
    },
    defaultVariants: {
      variant: 'file',
    },
  },
);

const resourceLabelVariants = cva(
  'group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85',
  {
    variants: {
      interactive: {
        true: 'hover:text-current',
      },
    },
  },
);

// Utility functions
const getResourceIcon = (fileName: string) => {
  const extension = fileName?.split('.').pop();
  if (extension) {
    return ['mp4'].includes(extension) ? 'video' : extension;
  }
  return 'file';
};

// Reusable components
function ResourceCheckbox({
  resource,
  parentChecked,
  isChecked: controlledIsChecked,
  setIsChecked: controlledSetIsChecked,
}: {
  resource: Resource;
  parentChecked: boolean;
  isChecked?: boolean;
  setIsChecked?: (value: boolean) => void;
}) {
  const { allItemsSelected, setAllItemsSelected } = useAllSelectedStore();
  const [uncontrolledIsChecked, setUncontrolledIsChecked] = useState(false);

  const isControlled = controlledIsChecked !== undefined;
  const isChecked = isControlled ? controlledIsChecked : uncontrolledIsChecked;
  const setIsChecked = isControlled
    ? controlledSetIsChecked
    : setUncontrolledIsChecked;

  const currentUncheck = useUncheckStore((state) => state.currentUncheck);

  useEffect(() => {
    if (currentUncheck > 0) {
      setIsChecked?.(false);
    }
  }, [currentUncheck, setIsChecked]);

  const handleCheckedChange = useCallback(
    (value: boolean) => {
      if (!value) {
        setAllItemsSelected(false);
      }
      setIsChecked?.(value);
    },
    [setAllItemsSelected, setIsChecked],
  );

  useEffect(() => {
    if (allItemsSelected) {
      setIsChecked?.(true);
    }
  }, [allItemsSelected, setIsChecked]);

  return (
    <>
      <Checkbox
        className={clsx('mr-2 border-muted-foreground/40', {
          'opacity-50': parentChecked,
        })}
        checked={allItemsSelected || isChecked || parentChecked}
        disabled={parentChecked}
        onCheckedChange={handleCheckedChange}
        value={resource.resource_id}
      />
      {(allItemsSelected || isChecked) && !parentChecked && (
        <input
          type="hidden"
          name="selectedItems"
          value={resource.resource_id}
        />
      )}
    </>
  );
}

function ResourceRemoveButton({ resource }: { resource: Resource }) {
  return (
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
        <p>Remove from knowledge base: {resource.knowledge_base_id}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ResourceTooltip({ resource }: { resource: Resource }) {
  return (
    <TooltipContent>
      <p>Created at: {new Date(resource.created_at).toLocaleString()}</p>
      <p>Modified at: {new Date(resource.modified_at).toLocaleString()}</p>
    </TooltipContent>
  );
}

function Directory({
  level,
  resource,
  parentChecked,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const queryClient = useQueryClient();
  const { data: connectionId } = useConnectionId();

  const prefetchResources = useCallback(() => {
    if (!connectionId) return;
    queryClient.prefetchQuery({
      queryKey: ['resources', connectionId, resource.resource_id],
      queryFn: () => {
        return fetchResources(connectionId, resource.resource_id);
      },
      staleTime: 30000,
    });
  }, [queryClient, connectionId, resource.resource_id]);

  return (
    <>
      <div
        className={resourceRowVariants({ variant: 'directory' })}
        onMouseEnter={prefetchResources}
        onFocus={prefetchResources}
        style={{
          paddingLeft: `${level * 26}px`,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 h-6 w-6 p-0"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform', {
              'rotate-90 transform': isOpen,
            })}
          />
        </Button>
        <ResourceCheckbox
          resource={resource}
          parentChecked={parentChecked}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={resourceLabelVariants()}>
              <Image
                src="/file-types/directory.svg"
                alt="directory"
                width={20}
                height={20}
                className="size-5"
              />
              <span className="flex-1">
                {extractFileName(resource.inode_path.path)}
              </span>
            </div>
          </TooltipTrigger>
          <ResourceTooltip resource={resource} />
        </Tooltip>
      </div>
      {isOpen && (
        <GoogleDriveResources
          parentId={resource.resource_id}
          level={level + 1}
          parentChecked={parentChecked || isChecked}
        />
      )}
    </>
  );
}

function File({
  level,
  resource,
  parentChecked,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
}) {
  const icon = getResourceIcon(resource.inode_path.path);

  return (
    <div
      className={resourceRowVariants()}
      style={{ paddingLeft: `${level * 26}px` }}
    >
      <span className="mr-1 h-6 w-6 p-0"></span>
      {resource.knowledge_base_id &&
      resource.knowledge_base_id !== DEFAULT_KNOWLEDGE_ID ? (
        <ResourceRemoveButton resource={resource} />
      ) : (
        <ResourceCheckbox resource={resource} parentChecked={parentChecked} />
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={resource.dataloader_metadata.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className={resourceLabelVariants({ interactive: true })}
          >
            <Image
              src={`/file-types/${icon}.svg`}
              alt={icon}
              width={20}
              height={20}
            />
            <span className="flex-1">
              {extractFileName(
                resource.dataloader_metadata.path ?? resource.inode_path.path,
              )}
            </span>
            <ExternalLink className="h-4 w-4 text-foreground/50 group-hover:text-current" />
          </a>
        </TooltipTrigger>
        <ResourceTooltip resource={resource} />
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
  parentChecked = false,
}: {
  parentId?: string;
  level?: number;
  parentChecked?: boolean;
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
          'flex min-h-10 animate-pulse flex-col items-center justify-center text-muted-foreground',
          {
            'flex-1': level === 0,
            'border-t border-muted-foreground/10': level > 0,
          },
        )}
      >
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
            parentChecked={parentChecked}
          />
        ) : (
          <File
            key={resource.resource_id}
            level={level}
            resource={resource}
            parentChecked={parentChecked}
          />
        ),
      )}
    </>
  );
}
