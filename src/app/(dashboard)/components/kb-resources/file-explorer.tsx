import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import {
  ChevronRight,
  FileIcon,
  Folder,
  FolderOpen,
  Trash2,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import useDeleteResourceMutation from '../../pods/kb/use-delete-resource-mutation';
import useKbResourcesQuery from '../../pods/kb/use-kb-resources-query';
import { Resource } from '../../pods/resources/schemas';
import * as BaseItem from './base-item';
import SkeletonItems from './skeleton-items';

function DirectoryItem({
  level,
  resource,
  kbId,
}: {
  level: number;
  resource: Resource;
  kbId: string;
}) {
  const hasBeenExpanded = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const FolderIcon = isExpanded ? FolderOpen : Folder;
  return (
    <>
      <BaseItem.Root
        onClick={() => {
          setIsExpanded((prev) => !prev);
          hasBeenExpanded.current = true;
        }}
        isFolder
      >
        <BaseItem.Separator level={level} isFolder />
        <span className="-m-0.5 flex items-center justify-center p-0">
          <ChevronRight
            width={18}
            height={18}
            className={clsx(
              'opacity-100 transition-transform',
              isExpanded ? 'rotate-90' : 'rotate-0',
            )}
          />
        </span>
        <FolderIcon
          width={18}
          height={18}
          className={BaseItem.iconBaseClasses}
        />
        <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
        <BaseItem.Size>{resource.size}</BaseItem.Size>
        <BaseItem.Status>{resource.status}</BaseItem.Status>
        <div className="w-10"></div>
      </BaseItem.Root>
      {(isExpanded || hasBeenExpanded.current) && (
        <Resources
          parentPath={resource.inode_path.path}
          level={level + 1}
          isExpanded={isExpanded}
          kbId={kbId}
        />
      )}
    </>
  );
}

function FileItem({
  level,
  resource,
  onDeleteResource,
}: {
  level: number;
  resource: Resource;
  onDeleteResource: (resourcePath: string) => void;
}) {
  return (
    <>
      <BaseItem.Root>
        <BaseItem.Separator level={level} isFolder={false} />
        <FileIcon path={resource.inode_path.path} />
        <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
        <BaseItem.Size>{resource.size}</BaseItem.Size>
        <BaseItem.Status>{resource.status}</BaseItem.Status>
        <div className="flex w-10 items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteResource(resource.inode_path.path)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </BaseItem.Root>
    </>
  );
}

function Resources({
  parentPath,
  level = 0,
  isExpanded = false,
  kbId,
}: {
  parentPath: string;
  level?: number;
  isExpanded?: boolean;
  kbId: string;
}) {
  const { data } = useKbResourcesQuery(kbId, parentPath);
  const deleteResourceMutation = useDeleteResourceMutation(kbId, parentPath);
  const handleDeleteResource = useCallback(
    (resourcePath: string) => {
      deleteResourceMutation.mutate(resourcePath);
    },
    [deleteResourceMutation],
  );

  if (!isExpanded && level > 0) {
    return null;
  }

  if (!data) {
    return <SkeletonItems level={level} />;
  }

  if (data.length === 0) {
    return (
      <Alert variant="default">
        <AlertTitle>No resources found</AlertTitle>
        <AlertDescription>
          No resources found in the path {parentPath}.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <>
      {data.map((resource) =>
        resource.inode_type === 'directory' ? (
          <DirectoryItem
            key={resource.resource_id}
            resource={resource}
            level={level}
            kbId={kbId}
          />
        ) : (
          <FileItem
            key={resource.resource_id}
            resource={resource}
            level={level}
            onDeleteResource={handleDeleteResource}
          />
        ),
      )}
    </>
  );
}

export default function FileExplorer({ kbId }: { kbId: string }) {
  return (
    <div className="rounded-b-lg border border-t-0 border-border bg-background p-1">
      <Resources kbId={kbId} parentPath="/" level={0} />
    </div>
  );
}
