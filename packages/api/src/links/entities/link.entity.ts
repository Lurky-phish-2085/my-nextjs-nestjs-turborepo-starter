import { ApiProperty } from '@nestjs/swagger';

export class Link {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
