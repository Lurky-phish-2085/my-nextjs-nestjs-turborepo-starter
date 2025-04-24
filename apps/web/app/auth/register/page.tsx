import RegisterPage from '@/components/pages/auth/register.page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description:
    'A basic Next.js (Shadcn + TailwindCSS) and NestJS monorepo starter',
};

export default function Page() {
  return <RegisterPage />;
}
