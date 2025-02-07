import { AlertCircle, ChevronRight, Folder } from 'lucide-react';
import Image from 'next/image';
import * as BaseItem from './base-item';
import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Resource } from '@/app/(dashboard)/pods/resources/schemas';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import SkeletonItems from './skeleton-items';

function FileItem({
  level,
  resource,
  parentChecked,
}: {
  level: number;
  resource: Resource;
  parentChecked: boolean;
}) {
  return (
    <>
      <BaseItem.Root>
        <BaseItem.Checkbox checked={parentChecked} onCheckedChange={() => {}} />
        <BaseItem.Separator level={level} isFolder={false} />
        <Image
          alt="pdf"
          width="18"
          height="18"
          className={BaseItem.iconBaseClasses}
          src="/file-types/pdf.svg"
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <BaseItem.Root isFolder>
        <BaseItem.Checkbox checked={parentChecked} onCheckedChange={() => {}} />
        <BaseItem.Separator level={level} isFolder />
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="-m-0.5 flex items-center justify-center p-0"
        >
          <ChevronRight
            width={18}
            height={18}
            className={cn(
              'opacity-100 transition-transform',
              isExpanded ? 'rotate-90' : 'rotate-0',
            )}
          />
        </button>
        <Folder width={18} height={18} className={BaseItem.iconBaseClasses} />
        <BaseItem.Name>{resource.inode_path.path}</BaseItem.Name>
        <BaseItem.Size>{resource.size}</BaseItem.Size>
      </BaseItem.Root>
      {isExpanded && (
        <Resources
          parentId={resource.resource_id}
          level={level + 1}
          parentChecked={parentChecked}
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
    return <SkeletonItems level={level} />
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
  return (
    <div className="relative flex min-h-max flex-col gap-1 rounded-b-lg border border-t-0 border-border bg-background p-1">
      <Resources />
    </div>
  );
}
