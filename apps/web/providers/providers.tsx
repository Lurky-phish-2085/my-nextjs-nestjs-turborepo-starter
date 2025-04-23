'use client';

import { ReactNode } from 'react';
import ModalProvider from './modal.provider';
import TanstackProvider from './tanstack-query-client.provider';
import AuthUserProvider from './auth-user.provider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
      <AuthUserProvider>
        <ModalProvider>{children}</ModalProvider>
      </AuthUserProvider>
    </TanstackProvider>
  );
}
