import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

import { formatFileSize } from '@/app/(dashboard)/pods/resources/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export const iconBaseClasses = 'h-[18px] min-h-[18px] w-[18px] min-w-[18px]';

const root = cva(
  'flex h-9 items-center gap-0.5 rounded-md text-sm transition-colors',
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
  onClick,
}: { children: ReactNode } & RootVariants & { onClick?: () => void }) {
  return (
    <div className={root({ isFolder })} onClick={onClick}>
      <div className="flex w-full items-center gap-2">{children}</div>
    </div>
  );
}

export function Separator({
  level,
  isFolder,
}: {
  level: number;
  isFolder: boolean;
}) {
  return (
    <div
      className={!isFolder ? clsx(iconBaseClasses, 'mr-2') : undefined}
      style={{ marginLeft: `${level * 1.625}rem` }}
    ></div>
  );
}

export function Name({ children }: { children: string }) {
  return (
    <p className="flex flex-1 items-center gap-2">
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

const VARIANT = {
  indexed: 'bg-green-100 text-green-600',
  pending: 'bg-yellow-100 text-yellow-600',
  failed: 'bg-red-100 text-red-600',
} as const;

const isValidVariant = (variant?: string): variant is keyof typeof VARIANT => {
  if (variant === undefined) {
    return true;
  }
  return variant in VARIANT;
};

const status = cva(
  'w-5 h-5 rounded-full inline-flex items-center justify-center',
  {
    variants: {
      variant: VARIANT,
    },
  },
);

export function Status({ children }: { children?: string }) {
  return children ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-16 min-w-16 items-center justify-center">
          <span className="sr-only">{children}</span>
          <span
            className={status({
              variant: isValidVariant(children) ? children : 'pending',
            })}
          >
            <Check className="h-4 w-4" />
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <div className="w-16 min-w-16" />
  );
}
