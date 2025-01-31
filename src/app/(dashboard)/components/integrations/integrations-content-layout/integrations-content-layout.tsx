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
    <div className="flex flex-1 flex-col h-full">
      <DialogHeader className="mx-4 border-b py-2 md:py-4 md:mx-6">
        <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
