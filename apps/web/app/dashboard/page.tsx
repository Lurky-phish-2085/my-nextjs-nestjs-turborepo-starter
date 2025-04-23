'use client';

import { useAuthUser } from '@/providers/auth-user.provider';

export default function Page() {
  const { authUser } = useAuthUser();

  return (
    <>
      <h1 className="text-2xl font-bold">You are now authenticated!</h1>
      <p>Hi, {authUser?.name}!</p>
      {authUser?.email}
    </>
  );
}
