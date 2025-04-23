'use client';

import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Routes } from '@/constants/routes';
import { handleFormError } from '@/lib/utils';
import { login } from '@/services/auth.service';

import { LoginUserDto } from '@repo/api-lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<LoginUserDto>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: async (form: LoginUserDto) => {
      return login(form);
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });

      router.push(Routes.DASHBOARD);
    },
    onError: async (error: AxiosError) => {
      handleFormError(error, {
        errorResolver: (response) => {
          if (!response.error) return;

          setError('root', { message: response.message });
        },
        fieldErrorsResolver: (field, message) => {
          setError(field as any, message);
        },
      });
    },
  });

  const submit = (values: LoginUserDto) => {
    loginMutate(values);
  };

  return (
    <div className="grid place-items-center h-screen">
      <Form {...form}>
        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          <h1 className="text-2xl font-semibold text-center">
            <Link href={Routes.HOME}>App Title</Link>
          </h1>
          <FormField
            name="email"
            disabled={isPending}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            disabled={isPending}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
                {errors.root && (
                  <FormMessage>{errors.root.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Link
              href={Routes.AUTH_REGISTER}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Don't have an account?
            </Link>
            <Button type="submit" disabled={isPending}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
