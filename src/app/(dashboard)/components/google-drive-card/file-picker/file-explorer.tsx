import { AlertCircle, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import * as BaseItem from './base-item';
import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Resource } from '@/app/(dashboard)/pods/resources/schemas';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import SkeletonItems from './skeleton-items';
import { useFilePickerStore } from './store';

const getResourceIcon = (fileName: string) => {
  const extension = fileName?.split('.').pop();
  if (extension) {
    return ['mp4'].includes(extension) ? 'video' : extension;
  }
  return 'file';
};

function FileItem({
  level,
  resource,
  parentChecked,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
}) {
  const removeId = useFilePickerStore((state) => state.removeId);
  const addId = useFilePickerStore((state) => state.addId);
  return (
    <>
      <BaseItem.Root>
        <BaseItem.Checkbox
          level={level}
          resourceId={resource.resource_id}
          parentChecked={parentChecked}
          onCheckedChange={(newValue) => {
            const fn = newValue ? addId : removeId;
            fn(resource.resource_id);
          }}
        />
        <BaseItem.Separator level={level} isFolder={false} />
        <Image
          alt="pdf"
          width="18"
          height="18"
          className={BaseItem.iconBaseClasses}
          src={`/file-types/${getResourceIcon(resource.inode_path.path)}.svg`}
        />
        <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
        <BaseItem.Size>{resource.size}</BaseItem.Size>
      </BaseItem.Root>
    </>
  );
}

function DirectoryItem({
  level,
  resource,
  parentChecked,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
}) {
  const { data } = useResourcesQuery('gdrive', resource.resource_id);
  const [isExpanded, setIsExpanded] = useState(false);
  const isChecked = useFilePickerStore((state) =>
    state.ids.includes(resource.resource_id),
  );
  const updateIds = useFilePickerStore((state) => state.updateIds);
  const childIds =
    data?.filter((r) => r.inode_type === 'file').map((r) => r.resource_id) ??
    [];
  const FolderIcon = isExpanded ? FolderOpen : Folder;

  return (
    <>
      <BaseItem.Root isFolder>
        <BaseItem.Checkbox
          level={level}
          resourceId={resource.resource_id}
          parentChecked={parentChecked}
          onCheckedChange={(newValue) => {
            if (newValue) {
              updateIds([resource.resource_id], childIds);
            } else {
              updateIds([], [resource.resource_id, ...childIds]);
            }
          }}
        />
        <div className="flex w-full items-center gap-2 h-9" onClick={() => {
          console.log('toggle', resource.resource_id, isExpanded ? 'close' : 'open');
          setIsExpanded((prev) => !prev);
        }}>
          <BaseItem.Separator level={level} isFolder />
          <span className="-m-0.5 flex items-center justify-center p-0">
            <ChevronRight
              width={18}
              height={18}
              className={cn(
                'opacity-100 transition-transform',
                isExpanded ? 'rotate-90' : 'rotate-0',
              )}
            />
          </span>
          <FolderIcon width={18} height={18} className={BaseItem.iconBaseClasses} />
          <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
          <BaseItem.Size>{resource.size}</BaseItem.Size>
        </div>
      </BaseItem.Root>
      {isExpanded && (
        <Resources
          parentId={resource.resource_id}
          level={level + 1}
          parentChecked={parentChecked || isChecked}
        />
      )}
    </>
  );
}

function Resources({
  parentId,
  level = 0,
  parentChecked = false,
}: {
  parentId?: string;
  level?: number;
  parentChecked?: boolean;
}) {
  const { data, error } = useResourcesQuery('gdrive', parentId);

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
    return <SkeletonItems level={level} />;
  }

  return (
    <>
      {data.map((resource) =>
        resource.inode_type === 'directory' ? (
          <DirectoryItem
            key={resource.resource_id}
            level={level}
            resource={resource}
            parentChecked={parentChecked}
          />
        ) : (
          <FileItem
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

export default function FileExplorer({
  onSubmit,
}: {
  onSubmit: (kbId: string) => void;
}) {
  const reset = useFilePickerStore((state) => state.reset);
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <div className="relative flex min-h-max flex-col gap-1 rounded-b-lg border border-t-0 border-border bg-background p-1">
      <Resources />
    </div>
  );
}
