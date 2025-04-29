import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@repo/api/posts/entities/post.entity';
import { AbilityModule } from 'src/ability/ability.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AbilityModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
