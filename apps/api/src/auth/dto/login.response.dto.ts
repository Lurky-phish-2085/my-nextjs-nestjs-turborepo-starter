import { ApiProperty } from '@nestjs/swagger';
import { User } from '@repo/api/users/entities/user.entity';

export class LoginResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
