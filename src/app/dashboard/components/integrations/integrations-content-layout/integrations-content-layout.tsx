import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReactNode } from 'react';

export default function IntegrationsContentLayout({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 flex-col">
      <DialogHeader className="mx-4 border-b py-2 md:mx-6 md:py-4">
        <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
