'use client';

import { INTEGRATION_NAMES } from '@/app/(dashboard)/config';
import useResources from '../use-resources';
import { Button } from '@/components/ui/button';
import { useCurrentIntegrationStore } from '@/app/(dashboard)/store';
import useKbResources from '../../knowledge-base/use-kb-resources';
import { useSearchParams } from 'next/navigation';

export default function GoogleDriveTrigger() {
  const searchParams = useSearchParams();
  const kbId = searchParams.get('kbId');
  useResources();
  useKbResources(kbId);
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
