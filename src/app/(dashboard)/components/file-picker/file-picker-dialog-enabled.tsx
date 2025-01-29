'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrentIntegrationStore } from '../../store';
import FilePickerSidebar from './file-picker-sidebar';

export default function FilePickerDialogEnabled() {
  const currentIntegration = useCurrentIntegrationStore((state) => state.currentIntegration);
  const resetCurrentIntegration = useCurrentIntegrationStore((state) => state.resetCurrentIntegration); 
  return (
    <Dialog open={currentIntegration !== null} onOpenChange={(open) => {
      if (!open) {
        resetCurrentIntegration();
      }
    }}>
      <DialogContent className="max-w-screen-xl p-0">
        <div className="flex h-[32rem]">
          <FilePickerSidebar />
          <div className="flex-1">
          <DialogHeader className="mx-6 border-b py-2">
            <DialogTitle>Not implemented</DialogTitle>
          </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
