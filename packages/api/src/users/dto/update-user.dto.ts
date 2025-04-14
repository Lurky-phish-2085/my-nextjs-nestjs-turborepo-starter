import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  password?: string;
}
