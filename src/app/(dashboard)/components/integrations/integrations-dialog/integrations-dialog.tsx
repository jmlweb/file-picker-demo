'use client';

import { useCurrentIntegrationStore } from '@/app/(dashboard)/store';
import { useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { INTEGRATION_NAMES } from '@/app/(dashboard)/config';

const EnabledIntegrationsDialog = dynamic(
  () => import('./enabled-integrations-dialog'),
);

const GoogleDriveSection = dynamic(
  () => import('../google-drive/google-drive-section'),
);

const NotImplemented = dynamic(
  () => import('../not-implemented/not-implemented'),
);

export default function IntegrationsDialog() {
  const currentIntegration = useCurrentIntegrationStore(
    (state) => state.currentIntegration,
  );
  const open = currentIntegration !== null;
  const resetCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.resetCurrentIntegration,
  );
  const hasBeenOpenedRef = useRef(false);

  const onOpenChange = useCallback(
    (newState: boolean) => {
      if (newState) {
        hasBeenOpenedRef.current = true;
      } else {
        resetCurrentIntegration();
      }
    },
    [resetCurrentIntegration],
  );

  if (!open && !hasBeenOpenedRef.current) {
    return null;
  }

  return (
    <EnabledIntegrationsDialog open={open} onOpenChange={onOpenChange}>
      {currentIntegration === INTEGRATION_NAMES['google-drive'] ? (
        <GoogleDriveSection />
      ) : (
        <NotImplemented />
      )}
    </EnabledIntegrationsDialog>
  );
}
