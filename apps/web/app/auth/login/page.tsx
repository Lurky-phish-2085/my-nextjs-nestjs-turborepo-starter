import LoginPage from '@/components/pages/auth/login.page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'A basic Next.js (Shadcn + TailwindCSS) and NestJS monorepo starter',
};

export default function Page() {
  return <LoginPage />;
}
