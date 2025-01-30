'use client';

import { Button } from '@/components/ui/button';
import { useCurrentIntegrationStore } from '../../store';
import { IntegrationName } from '../../config';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import clsx from 'clsx';

export default function FilePickerButton({
  integrationName,
  children,
  className,
  onClick,
  ...rest
}: {
  integrationName: IntegrationName;
  children: ReactNode;
} & ComponentPropsWithoutRef<'button'>) {
  const setCurrentIntegration = useCurrentIntegrationStore((state) => state.setCurrentIntegration);

  return (
    <Button
      className={clsx('w-full', className)}
      onClick={(e) => {
        setCurrentIntegration(integrationName);
        if (onClick) {
          onClick(e);
        }
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
