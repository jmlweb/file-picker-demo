import { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import DialogLayout from './dialog-layout';
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import FileExplorer from './file-explorer';
import { useFilePickerStore } from './store';
import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

function Header() {
  const isCheckAllSelected = useFilePickerStore(
    (state) => state.isCheckAllSelected,
  );
  const enableCheckAll = useFilePickerStore((state) => state.enableCheckAll);
  const disableCheckAll = useFilePickerStore((state) => state.disableCheckAll);
  const { data: resources } = useResourcesQuery('gdrive');
  const ids = useMemo(
    () => resources?.map((r) => r.resource_id) ?? [],
    [resources],
  );
  return (
    <div className="sticky top-0 z-10 min-h-max bg-background">
      <div className="flex h-9 items-center rounded-t-lg border border-border pl-3.5 text-sm font-medium">
        <div className="flex flex-grow items-center gap-2">
          <span className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <Checkbox
              id="select-all"
              checked={isCheckAllSelected}
              onCheckedChange={(newValue: boolean) => {
                if (newValue) {
                  enableCheckAll(ids ?? []);
                } else {
                  disableCheckAll();
                }
              }}
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

function Footer() {
  const ids = useFilePickerStore((state) => state.ids);
  return (
    <DialogFooter className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-end gap-5 border-t border-border bg-background/50 p-4 backdrop-blur-md md:p-6">
      <p>
        <strong className="font-semibold">{ids.length}</strong> files selected
      </p>
      <Button disabled={ids.length === 0}>Create Knowledge Base</Button>
    </DialogFooter>
  );
}

export default function FilePickerDialog({
  open,
  onClose,
  onSubmit,
}: Omit<ComponentPropsWithoutRef<typeof DialogLayout>, 'children'> &
  ComponentPropsWithoutRef<typeof FileExplorer>) {
  return (
    <DialogLayout open={open} onClose={onClose}>
      <ScrollArea className="max-h-full">
        <div className="flex min-h-max flex-col px-1">
          <Header />
          <FileExplorer onSubmit={onSubmit} />
        </div>
        <ScrollBar orientation="vertical" className="z-10" />
      </ScrollArea>
      <Footer />
    </DialogLayout>
  );
}
