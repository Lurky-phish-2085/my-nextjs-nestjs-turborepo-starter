import AuthLayout from '@/components/layouts/auth.layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return <AuthLayout>{children}</AuthLayout>;
}
