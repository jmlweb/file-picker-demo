'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useCurrentIntegrationStore } from '../../store';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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

  if (!isOpen && !hasBeenOpenedRef.current) {
    return null;
  }

  const Component = currentIntegration
    ? INTEGRATION_COMPONENTS[currentIntegration as keyof typeof INTEGRATION_COMPONENTS] ?? FilePickerNotImplemented
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
      <DialogContent className="max-w-screen-xl p-0">
        <div className="flex h-[32rem]">
          <FilePickerSidebar />
          <div className="flex flex-col flex-1">
            <Component />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
