import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CreatePostDto } from '@repo/api/posts/dto/create-post.dto';
import { UpdatePostDto } from '@repo/api/posts/dto/update-post.dto';
import { User } from '@repo/api/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiUnauthorizedResponse } from 'src/common/decorators/ApiUnauthorizedResponse.decorator';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
