import Image from 'next/image';
import IntegrationsContentLayout from '../../integrations-content-layout/integrations-content-layout';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleDriveResources } from './google-drive-resources';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAllSelectedStore, useUncheckStore } from './store';
import { useCurrentIntegrationStore } from '@/app/(dashboard)/store';
import { useEffect, useRef } from 'react';

function AllItemsSelectedToggler() {
  const { allItemsSelected, toggleAllItemsSelected } = useAllSelectedStore();
  const incrementUncheck = useUncheckStore((state) => state.incrementUncheck);
  return (
    <div className="flex items-center space-x-2 py-4">
      <Checkbox
        id="select-all"
        checked={allItemsSelected}
        onCheckedChange={(value) => {
          toggleAllItemsSelected();
          if (!value) {
            incrementUncheck();
          }
        }}
      />
      <label
        htmlFor="select-all"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Select all
      </label>
    </div>
  );
}

function GoogleDriveSectionContent() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const resetCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.resetCurrentIntegration,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // retrieve the values from the form
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedItems = formData.getAll('selectedItems');
    console.log(selectedItems);
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollArea.style.setProperty(
        '--max-scroll-area',
        `${scrollArea.clientHeight - 20}px`,
      );
    });

    resizeObserver.observe(scrollArea);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
      <div className="mx-4 flex flex-1 flex-col md:mx-6">
        <AllItemsSelectedToggler />
        <TooltipProvider>
          <div className="flex flex-1 flex-col" ref={scrollAreaRef}>
            <ScrollArea className="w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[--max-scroll-area]">
              <GoogleDriveResources />
              <ScrollBar />
            </ScrollArea>
          </div>
        </TooltipProvider>
      </div>
      <DialogFooter className="mx-4 mt-auto items-center py-2 md:mx-6 md:py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          We recommend selecting as few items as needed.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => resetCurrentIntegration()}
          >
            Cancel
          </Button>
          <Button size="lg" type="submit">
            Select
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default function GoogleDriveSection() {
  return (
    <IntegrationsContentLayout
      title={
        <>
          <Image
            src="/logos/google-drive.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />{' '}
          Google Drive
        </>
      }
    >
      <GoogleDriveSectionContent />
    </IntegrationsContentLayout>
  );
}
