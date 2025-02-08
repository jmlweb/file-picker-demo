import { ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CardLayout({ children }: { children: ReactNode }) {
  return (
    <Card className="mx-auto w-[600px] max-w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image
            src="/logos/google-drive.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
          Google Drive
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
