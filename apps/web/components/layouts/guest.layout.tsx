import { Routes } from '@/constants/routes';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { Button } from '../atoms/button';

export default function GuestLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="p-4">
      <header className="flex gap-2 mb-4 items-center">
        <h1 className="text-2xl mr-auto font-semibold">
          <Link href={Routes.HOME}>App Title</Link>
        </h1>
        <Button asChild>
          <Link href={Routes.AUTH_LOGIN}>Login</Link>
        </Button>
        <Button asChild>
          <Link href={Routes.AUTH_REGISTER}>Register</Link>
        </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
