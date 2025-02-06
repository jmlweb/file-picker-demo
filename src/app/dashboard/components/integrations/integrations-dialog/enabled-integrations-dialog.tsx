import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { memo, ReactNode, useEffect, useState } from 'react';
import IntegrationsNav from './integrations-nav';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

function EnabledIntegrationsDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  const [scrollBarOrientation, setScrollBarOrientation] = useState<
    'horizontal' | 'vertical'
  >(mediaQuery.matches ? 'vertical' : 'horizontal');

  useEffect(() => {
    const updateScrollBarOrientation = (e: MediaQueryListEvent) => {
      setScrollBarOrientation(e.matches ? 'vertical' : 'horizontal');
    };

    mediaQuery.addEventListener('change', updateScrollBarOrientation);

    return () => {
      mediaQuery.removeEventListener('change', updateScrollBarOrientation);
    };
  }, [mediaQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[calc(100vh-32px)] max-h-[820px] w-[calc(100vw-32px)] max-w-screen-lg flex-col p-0 md:flex-row">
        <aside className="border-r border-foreground/10 bg-foreground/[0.02] md:w-60">
          <div className="flex items-center justify-start gap-1.5 border-b border-foreground/10 px-4 py-3 font-bold">
            <DialogClose className="outline-none ring-0">
              <X className="h-5 w-5" />
            </DialogClose>
            <DialogDescription className="text-foreground">
              Integrations
            </DialogDescription>
          </div>
          <ScrollArea className="h-16 w-full border md:h-[calc(640px-48px)] md:w-60 md:border-0">
            <IntegrationsNav />
            <ScrollBar orientation={scrollBarOrientation} />
          </ScrollArea>
        </aside>
        <div className="flex-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(EnabledIntegrationsDialog);
