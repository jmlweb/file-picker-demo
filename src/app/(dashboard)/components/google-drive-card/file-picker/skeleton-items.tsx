import { Skeleton } from '@/components/ui/skeleton';

import * as BaseItem from './base-item';
export default function SkeletonItems({ level }: { level: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <BaseItem.Root isFolder={false} key={index}>
          <Skeleton
            className="h-8 w-full rounded-md bg-gray-100"
            style={{ marginLeft: `calc(${level * 1.625}rem)` }}
            key={index}
          />
        </BaseItem.Root>
      ))}
    </>
  );
}
