'use client';

import { INTEGRATION_NAMES } from '@/app/(dashboard)/config';
import useResources from './use-resources';
import { Button } from '@/components/ui/button';
import { useCurrentIntegrationStore } from '@/app/(dashboard)/store';

export default function GoogleDriveTrigger() {
  useResources();
  const setCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.setCurrentIntegration,
  );

  return (
    <Button
      className="w-full"
      onClick={() => {
        setCurrentIntegration(INTEGRATION_NAMES['google-drive']);
      }}
    >
      Pick files from Google Drive
    </Button>
  );
}
