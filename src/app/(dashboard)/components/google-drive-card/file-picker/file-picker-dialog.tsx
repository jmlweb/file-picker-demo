import { ComponentPropsWithoutRef, useState } from 'react';
import DialogLayout from './dialog-layout';
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import FileExplorer from './file-explorer';

function Header({
  isCheckAllSelected,
  setIsCheckAllSelected,
}: {
  isCheckAllSelected: boolean;
  setIsCheckAllSelected: (isCheckAllSelected: boolean) => void;
}) {
  return (
    <div className="sticky top-0 z-10 min-h-max bg-background">
      <div className="flex h-9 items-center rounded-t-lg border border-border pl-3.5 text-sm font-medium">
        <div className="flex flex-grow items-center gap-2">
          <span className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <Checkbox
              id="select-all"
              checked={isCheckAllSelected}
              onCheckedChange={setIsCheckAllSelected}
              className="group-hover/checkbox:opacity-100 group-active/checkbox:scale-90"
            />
          </span>
          <div className="w-4.5"></div>
          <p>Name</p>
        </div>
        <p className="w-20">Size</p>
      </div>
    </div>
  );
}

export default function FilePickerDialog({
  open,
  onClose,
  onSubmit,
}: Omit<ComponentPropsWithoutRef<typeof DialogLayout>, 'children'> &
  ComponentPropsWithoutRef<typeof FileExplorer>) {
  const [isCheckAllSelected, setIsCheckAllSelected] = useState(false);
  return (
    <DialogLayout open={open} onClose={onClose}>
      <ScrollArea className="max-h-full">
        <div className="flex min-h-max flex-col px-1">
          <Header
            isCheckAllSelected={isCheckAllSelected}
            setIsCheckAllSelected={setIsCheckAllSelected}
          />
          <FileExplorer onSubmit={onSubmit} />
        </div>
        <ScrollBar orientation="vertical" className="z-10" />
      </ScrollArea>
    </DialogLayout>
  );
}
