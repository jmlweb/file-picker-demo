import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

import { Checkbox as CheckboxComponent } from '@/components/ui/checkbox';

import { type VariantProps } from 'class-variance-authority';
import { formatFileSize } from '@/app/(dashboard)/pods/resources/utils';

export const iconBaseClasses = 'h-[18px] min-h-[18px] w-[18px] min-w-[18px]';

const root = cva(
  'flex h-9 items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors',
  {
    variants: {
      isFolder: {
        true: 'cursor-pointer hover:bg-gray-100',
        false: null,
      },
    },
  },
);

type RootVariants = VariantProps<typeof root>;

export function Root({
  children,
  isFolder,
}: { children: ReactNode } & RootVariants) {
  return (
    <div className={root({ isFolder })}>
      <div className="flex w-full items-center gap-2">{children}</div>
    </div>
  );
}

export function Checkbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <span className="nodrag relative group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
      <CheckboxComponent
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="group-hover/checkbox:opacity-100 group-active/checkbox:scale-90"
      />
    </span>
  );
}

export function Separator({ level, isFolder }: { level: number; isFolder: boolean }) {
  return (
    <div
      className={!isFolder ? iconBaseClasses : undefined}
      style={{ marginLeft: `${level * 1.625}rem` }}
    ></div>
  );
}

export function Name({ children }: { children: string }) {
  return (
    <p className="flex flex-shrink flex-grow items-center gap-2">
      <span className="line-clamp-1 min-w-0 flex-shrink break-all">
        {children.split('/').pop() ?? children}
      </span>
    </p>
  );
}

export function Size({ children }: { children?: number }) {
  return (
    <div className="flex w-20 min-w-20 items-center">
      {children && (
        <div className="relative line-clamp-1 text-sm text-gray-600">
          {formatFileSize(children)}
        </div>
      )}
    </div>
  );
}
