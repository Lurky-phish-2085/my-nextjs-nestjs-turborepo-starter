'use client';

import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Routes } from '@/constants/routes';
import { handleFormError } from '@/lib/utils';
import { useModal } from '@/providers/modal.provider';
import { login, register } from '@/services/auth.service';

import { LoginUserDto, RegisterUserDto } from '@repo/api-lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
  const errorModal = useModal();

  const queryClient = useQueryClient();

  const router = useRouter();

  const form = useForm<RegisterUserDto>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const {
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate: loginMutate, isPending: isLoginLoading } = useMutation({
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

          errorModal.open({
            title: 'ERROR',
            description: response.message,
            isModal: true,
          });
        },
      });
    },
  });

  const { mutate: registerMutate, isPending: isRegistrationLoading } =
    useMutation({
      mutationFn: async (form: RegisterUserDto) => {
        return register(form);
      },
      onSuccess: (_, variables) => {
        loginMutate(variables);
      },
      onError: async (error: AxiosError) =>
        handleFormError(error, {
          errorResolver: (response) => {
            if (!response.error) return;

            setError('root', { message: response.message });
          },
          fieldErrorsResolver: (field, message) => {
            setError(field as any, message);
          },
        }),
    });

  const isFormLoading = isLoginLoading || isRegistrationLoading;

  const submit = (values: RegisterUserDto) => {
    registerMutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <h1 className="text-2xl font-semibold text-center">
          <Link href={Routes.HOME}>App Title</Link>
        </h1>
        <FormField
          name="email"
          disabled={isFormLoading}
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
          disabled={isFormLoading}
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
            </FormItem>
          )}
        />
        <FormField
          name="name"
          disabled={isFormLoading}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} required />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
              {errors.root && <FormMessage>{errors.root.message}</FormMessage>}
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <Link
            href={Routes.AUTH_LOGIN}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Already registered?
          </Link>
          <Button type="submit" disabled={isFormLoading}>
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
