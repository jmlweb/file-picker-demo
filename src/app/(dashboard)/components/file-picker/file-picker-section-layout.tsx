import { DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cva } from 'class-variance-authority';
import { ElementType, ReactNode } from 'react';

const scrollAreaStyle = cva(null, {
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
  icon?: ElementType;
  title: string;
  footer?: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex flex-1 flex-col gap-2">
      <DialogHeader className="mx-6 h-16 justify-center border-b py-4">
        <DialogTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />} {title}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className={scrollAreaStyle({ withFooter: !!footer })}>
        <div className="px-6 py-2">{children}</div>
      </ScrollArea>
      {footer && (
        <DialogFooter className="mx-6 h-16 items-center">{footer}</DialogFooter>
      )}
    </div>
  );
}
