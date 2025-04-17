import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const formattedErrors = validationErrors.reduce<Record<string, string[]>>(
        (acc, error) => {
          acc[error.property] = Object.values(error.constraints || {});
          return acc;
        },
        {},
      );
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    };
  }
}
