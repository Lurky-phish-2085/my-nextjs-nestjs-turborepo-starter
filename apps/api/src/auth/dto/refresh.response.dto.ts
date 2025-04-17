import { ApiProperty } from '@nestjs/swagger';
import { User } from '@repo/api/users/entities/user.entity';

export class RefreshResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;
}
