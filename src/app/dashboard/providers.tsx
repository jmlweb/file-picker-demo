'use client';

import useProfile from '@/app/dashboard/use-profile';
import { ReactNode } from 'react';

export default function DashboardProviders({
  children,
}: {
  children: ReactNode;
}) {
  // Prefetch query ASAP
  useProfile();
  return <>{children}</>;
}
