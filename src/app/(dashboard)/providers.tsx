'use client';

import useProfile from '@/app/(dashboard)/use-profile';
import { ReactNode, memo } from 'react';

function DashboardProviders({ children }: { children: ReactNode }) {
  const query = useProfile();
  console.log(query);
  return <>{children}</>;
}

export default memo(DashboardProviders);
