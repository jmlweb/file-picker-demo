import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import GoogleDriveTrigger from './google-drive-trigger';

export default function GoogleDriveCard() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Google Drive</CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleDriveTrigger />
      </CardContent>
    </Card>
  );
}
