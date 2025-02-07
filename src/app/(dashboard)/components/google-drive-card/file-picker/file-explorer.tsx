import { AlertCircle, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import * as BaseItem from './base-item';
import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Resource } from '@/app/(dashboard)/pods/resources/schemas';
import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import SkeletonItems from './skeleton-items';
import { useFilePickerStore } from './store';
import useSubscription from './useSubscription';

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
  parentSubscribe,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
  parentSubscribe?: ReturnType<typeof useSubscription>['subscribe'];
}) {
  const { data } = useResourcesQuery('gdrive', resource.resource_id);
  const [isExpanded, setIsExpanded] = useState(false);
  // preload the first level
  const hasBeenExpanded = useRef(level === 0);
  const updateIds = useFilePickerStore((state) => state.updateIds);
  const childIds = useMemo(() => data?.map((r) => r.resource_id) ?? [], [data]);
  const FolderIcon = isExpanded ? FolderOpen : Folder;
  const cb = useCallback((subIds: string[], isChecked: boolean) => {
    if (isChecked) {
      updateIds([resource.resource_id], subIds);
    } else {
      updateIds([], [resource.resource_id]);
    }
  }, [resource.resource_id, updateIds]);
  const { subscribe, execute } = useSubscription(cb, parentSubscribe);
  const onCheckedChange = useCallback((newValue: boolean) => {
    execute(newValue);
  }, [execute]);
  useEffect(() => {
    subscribe(childIds);
  }, [childIds, subscribe]);

  return (
    <>
      <BaseItem.Root isFolder>
        <BaseItem.Checkbox
          level={level}
          resourceId={resource.resource_id}
          parentChecked={parentChecked}
          onCheckedChange={onCheckedChange}
        />
        <div
          className="flex h-9 w-full items-center gap-2"
          onClick={() => {
            setIsExpanded((prev) => !prev);
            hasBeenExpanded.current = true;
          }}
        >
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
          <FolderIcon
            width={18}
            height={18}
            className={BaseItem.iconBaseClasses}
          />
          <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
          <BaseItem.Size>{resource.size}</BaseItem.Size>
        </div>
      </BaseItem.Root>
      {(isExpanded || hasBeenExpanded.current) && (
        <ParentResources
          parentId={resource.resource_id}
          level={level + 1}
          parentChecked={parentChecked}
          isExpanded={isExpanded}
          parentSubscribe={subscribe}
        />
      )}
    </>
  );
}

function Resources({
  parentId,
  level = 0,
  parentChecked = false,
  isExpanded = false,
  parentSubscribe,
}: {
  parentId?: string;
  level?: number;
  parentChecked?: boolean;
  isExpanded?: boolean;
  parentSubscribe?: ReturnType<typeof useSubscription>['subscribe'];
}) {
  const { data, error } = useResourcesQuery('gdrive', parentId);

  if (!isExpanded) {
    return null;
  }

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
            parentSubscribe={parentSubscribe}
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

function ParentResources({
  parentId,
  level = 0,
  parentChecked = false,
  isExpanded,
  parentSubscribe,
}: ComponentPropsWithoutRef<typeof Resources>) {
  const isChecked = useFilePickerStore((state) =>
    parentId ? state.ids.includes(parentId) : false,
  );
  return (
    <Resources
      parentId={parentId}
      level={level}
      parentChecked={parentChecked || isChecked}
      isExpanded={isExpanded || level === 0}
      parentSubscribe={parentSubscribe}
    />
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
    <div className="relative flex min-h-max flex-col gap-1 rounded-b-lg border border-t-0 border-border bg-background p-1 pb-20">
      <ParentResources />
    </div>
  );
}
