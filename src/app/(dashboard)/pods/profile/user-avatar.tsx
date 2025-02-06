'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useProfileQuery from './use-profile-query';

export default function UserAvatar() {
  useProfileQuery();
  return (
    <Avatar className="size-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
