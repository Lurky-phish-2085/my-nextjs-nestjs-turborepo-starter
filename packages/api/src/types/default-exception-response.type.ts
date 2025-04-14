import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DefaultExceptionResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[]; // Can be a string or an array of strings for validation errors
  @ApiPropertyOptional()
  error?: string; // Optional field
}
