'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleDriveTrigger from './google-drive-trigger';
import useResources from '../use-resources';

export default function GoogleDriveCard({ kbId }: { kbId: string | null }) {
  useResources();
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Google Drive</CardTitle>
      </CardHeader>
      <CardContent>
        {kbId && <p>{kbId}</p>}
        <GoogleDriveTrigger />
      </CardContent>
    </Card>
  );
}
