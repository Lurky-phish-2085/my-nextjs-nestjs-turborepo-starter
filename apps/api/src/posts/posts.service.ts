import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '@repo/api/posts/dto/create-post.dto';
import { UpdatePostDto } from '@repo/api/posts/dto/update-post.dto';
import { Post } from '@repo/api/posts/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(post);

    return post;
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, updatePostDto);

    return this.postsRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.postsRepository.delete(id);
  }
}
