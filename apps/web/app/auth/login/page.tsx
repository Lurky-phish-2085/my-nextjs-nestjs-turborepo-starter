import LoginForm from '@/components/molecules/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'A basic Next.js (Shadcn + TailwindCSS) and NestJS monorepo starter',
};

export default function Page() {
  return <LoginForm />;
}
