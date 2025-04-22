import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import MainModal from '@/components/molecules/main-modal';
import Providers from '@/providers/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turbo Next.js NestJS Monorepo',
  description:
    'A basic Next.js (Shadcn + TailwindCSS) and NestJS monorepo starter',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
