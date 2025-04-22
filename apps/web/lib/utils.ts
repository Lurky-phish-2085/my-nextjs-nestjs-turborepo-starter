import { DefaultExceptionResponse } from '@repo/api-lib/api';
import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleFormError(
  formError: AxiosError,
  {
    errorResolver = undefined,
    fieldErrorsResolver = undefined,
  }: {
    errorResolver?: (error: DefaultExceptionResponse) => void;
    fieldErrorsResolver?: (
      field: string,
      fieldErrorMessage: { message: string | undefined },
      formErrorMessage: string,
    ) => void;
  },
) {
  const form = formError.response?.data as DefaultExceptionResponse;
  const { errors: validationErrors, message } = form;

  errorResolver?.call(null, form);

  if (!validationErrors && fieldErrorsResolver) {
    return;
  }

  Object.keys(validationErrors as {}).map((field) => {
    fieldErrorsResolver!(
      field,
      { message: validationErrors?.[field]?.[0] },
      message,
    );
  });
}
