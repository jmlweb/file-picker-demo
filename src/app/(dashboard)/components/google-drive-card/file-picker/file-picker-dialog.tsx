import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { ComponentPropsWithoutRef, useMemo } from 'react';
import DialogLayout from './dialog-layout';
import FileExplorer from './file-explorer';
import { useFilePickerStore } from './store';

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

function Footer({
  onSubmit,
  isPending,
}: {
  onSubmit: () => void;
  isPending: boolean;
}) {
  const idsLength = useFilePickerStore((state) => state.ids.length);
  return (
    <div
      className={clsx(
        'absolute inset-x-0 bottom-0 z-50 overflow-hidden rounded-b-3xl bg-transparent transition-opacity duration-300',
        idsLength === 0 && 'pointer-events-none opacity-0',
      )}
    >
      <DialogFooter
        className={clsx(
          'flex items-center justify-end gap-5 border-t border-border bg-background/40 p-4 backdrop-blur-md transition duration-300 md:p-6',
          idsLength === 0 && 'translate-y-12',
        )}
      >
        <p>
          <strong className="font-semibold">{idsLength}</strong> files selected
        </p>
        <Button
          disabled={idsLength === 0 || isPending}
          onClick={onSubmit}
          className="relative"
        >
          <span
            className={clsx(
              'transition-opacity',
              isPending ? 'opacity-0' : 'opacity-100',
            )}
          >
            Create Knowledge Base
          </span>
          {isPending && (
            <Loader2 className="absolute ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function FilePickerDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: Omit<ComponentPropsWithoutRef<typeof DialogLayout>, 'children'> &
  ComponentPropsWithoutRef<typeof FileExplorer> &
  ComponentPropsWithoutRef<typeof Footer>) {
  return (
    <DialogLayout open={open} onClose={onClose}>
      <ScrollArea className="max-h-full">
        <div className="flex min-h-max flex-col px-1">
          <Header />
          <FileExplorer />
        </div>
        <ScrollBar orientation="vertical" className="z-10" />
      </ScrollArea>
      <Footer onSubmit={onSubmit} isPending={isPending} />
    </DialogLayout>
  );
}
