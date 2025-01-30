'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useCurrentIntegrationStore } from '../../store';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import FilePickerSidebar from './file-picker-sidebar';

const INTEGRATION_COMPONENTS = {
  'google-drive': dynamic(() => import('./google-drive/google-drive')),
} as const;

const FilePickerNotImplemented = dynamic(
  () => import('./file-picker-not-implemented'),
);

export default function FilePickerDialog() {
  const currentIntegration = useCurrentIntegrationStore(
    (state) => state.currentIntegration,
  );
  const resetCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.resetCurrentIntegration,
  );
  const isOpen = currentIntegration !== null;
  const hasBeenOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasBeenOpenedRef.current) {
      hasBeenOpenedRef.current = true;
    }
  }, [isOpen]);

  // If the dialog is not open and has not been opened, return null
  // This is to save on the initial render of the page
  if (!isOpen && !hasBeenOpenedRef.current) {
    return null;
  }

  const Component = currentIntegration
    ? (INTEGRATION_COMPONENTS[
        currentIntegration as keyof typeof INTEGRATION_COMPONENTS
      ] ?? FilePickerNotImplemented)
    : FilePickerNotImplemented;

  return (
    <Dialog
      open={currentIntegration !== null}
      onOpenChange={(open) => {
        if (!open) {
          resetCurrentIntegration();
        }
      }}
    >
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-screen-xl p-0 md:w-11/12"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex h-[40rem] max-w-full flex-col overflow-hidden md:h-[32rem] md:flex-row">
          <FilePickerSidebar />
          <div className="flex flex-1 flex-col">
            <Component />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
