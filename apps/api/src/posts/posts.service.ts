import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '@repo/api/posts/dto/create-post.dto';
import { UpdatePostDto } from '@repo/api/posts/dto/update-post.dto';
import { Post } from '@repo/api/posts/entities/post.entity';
import { User } from '@repo/api/users/entities/user.entity';
import { Action } from 'src/ability/ability.factory';
import { AbilityService } from 'src/ability/ability.service';
import { Repository } from 'typeorm';
import PostNotFoundException from './exceptions/post-not-found.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private abilityService: AbilityService,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author: user,
      authorId: user.id,
    });
    await this.postsRepository.save(newPost);

    return newPost;
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    authUser: User,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new PostNotFoundException(id);
    }

    this.abilityService.checkAbility(Action.Update, post, authUser);

    await this.postsRepository.update(id, updatePostDto);
    const updatedPost = this.postsRepository.findOneBy({ id });

    return updatedPost;
  }

  async remove(id: number, authUser: User): Promise<void> {
    const postToDelete = await this.findOne(id);

    this.abilityService.checkAbility(Action.Delete, postToDelete, authUser);

    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
