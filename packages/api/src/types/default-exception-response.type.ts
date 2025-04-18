import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DefaultExceptionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiPropertyOptional({
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
      {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    ],
  })
  error?: string | string[] | { [key: string]: string[] };
}
