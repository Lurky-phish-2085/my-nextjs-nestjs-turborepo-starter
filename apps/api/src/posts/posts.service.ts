import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '@repo/api/posts/dto/create-post.dto';
import { UpdatePostDto } from '@repo/api/posts/dto/update-post.dto';
import { Post } from '@repo/api/posts/entities/post.entity';
import { User } from '@repo/api/users/entities/user.entity';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import PostNotFoundException from './exceptions/post-not-found.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
    private abilityFactory: AbilityFactory,
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

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new PostNotFoundException(id);
    }

    this.checkAbility(Action.Update, post);

    await this.postsRepository.update(id, updatePostDto);
    const updatedPost = this.postsRepository.findOneBy({ id });

    return updatedPost;
  }

  async remove(id: number): Promise<void> {
    const postToRemove = await this.postsRepository.findOneBy({ id });

    this.checkAbility(Action.Delete, postToRemove);

    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }

  private async checkAbility(action: Action, post: Post) {
    const authorId = post.author.id;
    const user = await this.usersService.findById(authorId);

    const abilities = this.abilityFactory.defineAbility(user);

    try {
      ForbiddenError.from(abilities).throwUnlessCan(action, post);

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
