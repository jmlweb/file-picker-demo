import { DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { ReactNode } from 'react';

const scrollAreaStyle = cva('overflow-y-auto', {
  variants: {
    withFooter: {
      true: 'h-[calc(32rem-128px-16px)]',
      false: 'h-[calc(32rem-64px-8px)]',
    },
  },
});

export default function FilePickerSectionLayout({
  children,
  icon,
  title,
  footer,
}: {
  children: ReactNode;
  icon?: string;
  title: string;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <DialogHeader className="mx-4 h-16 justify-center border-b py-4 md:mx-6">
        <DialogTitle className="flex items-center gap-2">
          {icon && <Image src={icon} alt="" width={24} height={24} className="size-6" />} {title}
        </DialogTitle>
      </DialogHeader>
      <div className={scrollAreaStyle({ withFooter: !!footer })}>
        <div className="px-4 py-2 md:px-6">{children}</div>
      </div>
      {footer && (
        <DialogFooter className="mx-4 h-16 items-center md:mx-6">
          {footer}
        </DialogFooter>
      )}
    </div>
  );
}
