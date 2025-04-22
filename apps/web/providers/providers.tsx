'use client';

import { ReactNode } from 'react';
import ModalProvider from './modal.provider';
import TanstackProvider from './tanstack-query-client.provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
      <ModalProvider>{children}</ModalProvider>
    </TanstackProvider>
  );
}
