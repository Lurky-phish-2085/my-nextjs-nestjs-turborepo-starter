import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DefaultExceptionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  error?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  errors?: { [key: string]: string[] };
}
