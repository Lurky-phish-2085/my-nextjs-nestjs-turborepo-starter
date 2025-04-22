import RegisterForm from '@/components/molecules/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description:
    'A basic Next.js (Shadcn + TailwindCSS) and NestJS monorepo starter',
};

export default function Page() {
  return <RegisterForm />;
}
