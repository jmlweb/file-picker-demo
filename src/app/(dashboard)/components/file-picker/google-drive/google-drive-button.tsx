'use client';

import { INTEGRATION_NAMES } from '@/app/(dashboard)/config';
import FilePickerButton from '../file-picker-button';
import useRootResources from './use-root-resources';

export default function GoogleDriveButton() {
  useRootResources();

  return (
    <FilePickerButton
      integrationName={INTEGRATION_NAMES['google-drive']}
    >
      Pick files from Google Drive
    </FilePickerButton>
  );
}
