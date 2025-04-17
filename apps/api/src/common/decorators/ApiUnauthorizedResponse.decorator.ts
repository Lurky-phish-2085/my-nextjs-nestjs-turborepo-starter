import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DefaultExceptionResponse } from '@repo/api/types/default-exception-response.type';

export function ApiUnauthorizedResponse(options?: {
  status?: HttpStatus;
  description?: string;
  type?: typeof DefaultExceptionResponse;
  example?: { status: any; message: string; error: string };
}) {
  return ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: options?.description ?? 'Unauthorized access to resource',
    type: options?.type ?? DefaultExceptionResponse,
    example: options?.example ?? {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
      error: 'optional error message',
    },
  });
}
