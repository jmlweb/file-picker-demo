'use client';

import { INTEGRATION_NAMES } from '@/app/(dashboard)/config';
import FilePickerButton from '../file-picker-button';
import { useQueryClient } from '@tanstack/react-query';
import { fetchConnectionId } from './google-drive-service';

export default function GoogleDriveButton() {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['connectionId'],
      queryFn: fetchConnectionId,
      // Prefetch only fires when data is older than the staleTime,
      // so in a case like this you definitely want to set one
      staleTime: 60000,
    });
  };

  return (
    <FilePickerButton
      integrationName={INTEGRATION_NAMES['google-drive']}
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      Pick files from Google Drive
    </FilePickerButton>
  );
}
