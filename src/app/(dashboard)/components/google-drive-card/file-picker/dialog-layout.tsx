import Image from 'next/image';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export default function DialogLayout({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="flex h-[calc(100vh-32px)] max-h-[820px] w-[calc(100vw-32px)] max-w-screen-lg flex-col p-0 md:flex-row">
        <div className="flex h-full flex-1 flex-col">
          <DialogHeader className="border-b px-4 py-2 md:px-6 md:py-4 flex flex-row justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <Image
                src="/logos/google-drive.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />{' '}
              Pick files from Google Drive
            </DialogTitle>
            <DialogClose>
              <X className="h-5 w-5" />
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
