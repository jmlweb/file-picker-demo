import Image from 'next/image';
import IntegrationsContentLayout from '../../integrations-content-layout/integrations-content-layout';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleDriveResources } from './google-drive-resources';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';

function GoogleDriveSectionContent() {
  return (
    <>
      <div className="mx-4 flex flex-1 flex-col md:mx-6">
        <div className="flex items-center space-x-2 py-4">
          <Checkbox id="select-all" />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select all
          </label>
        </div>
        <TooltipProvider>
          <div className="max-h-[641px] flex-1">
            <ScrollArea className="h-full">
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
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button size="lg">Select 2</Button>
        </div>
      </DialogFooter>
    </>
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
