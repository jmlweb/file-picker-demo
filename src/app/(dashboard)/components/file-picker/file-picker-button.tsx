'use client';

import { Button } from '@/components/ui/button';
import { useCurrentIntegrationStore } from '../../store';
import { IntegrationName } from '../../config';
import { ReactNode } from 'react';

export default function FilePickerButton({
  integrationName,
  children,
}: {
  integrationName: IntegrationName;
  children: ReactNode;
}) {
  const setCurrentIntegration = useCurrentIntegrationStore((state) => state.setCurrentIntegration);

  return (
    <Button
      className="w-full"
      onClick={() => setCurrentIntegration(integrationName)}
    >
      {children}
    </Button>
  );
}
