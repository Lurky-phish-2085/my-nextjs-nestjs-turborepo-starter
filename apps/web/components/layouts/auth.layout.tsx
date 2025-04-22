'use client';

import { Routes } from '@/constants/routes';
import { handleFormError } from '@/lib/utils';
import { useModal } from '@/providers/modal.provider';
import { logout } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Button } from '../atoms/button';

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  const router = useRouter();

  const errorModal = useModal();

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      router.push(Routes.HOME);
    },
    onError: async (error: AxiosError) => {
      handleFormError(error, {
        errorResolver: (response) => {
          if (!response.error) return;

          errorModal.open({
            title: 'ERROR',
            description: response.message,
            isModal: true,
          });
        },
      });
    },
  });

  return (
    <div className="p-4">
      <header className="flex gap-2 mb-4 items-center">
        <h1 className="text-2xl mr-auto font-semibold">
          <Link href={Routes.HOME}>App Title</Link>
        </h1>
        <Button onClick={() => logoutMutate()} disabled={isPending}>
          Logout
        </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
