import { Link } from 'links/entities/link.entity';

import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { CreatePostDto } from 'posts/dto/create-post.dto';
import { UpdatePostDto } from 'posts/dto/update-post.dto';
import { Post } from 'posts/entities/post.entity';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { UpdateUserDto } from 'users/dto/update-user.dto';
import { RegisterUserDto } from './auth/dto/register-user.dto';
import { User } from './users/entities/user.entity';

export * from './auth/dto/register-user.dto';
export * from './auth/dto/login-user.dto';
export * from './posts/entities/post.entity';
export * from './types/default-exception-response.type';
export * from './users/entities/user.entity';

export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
  },
};

export const post = {
  dto: {
    CreatePostDto,
    UpdatePostDto,
  },
  entities: {
    Post,
  },
};

export const users = {
  dto: {
    CreateUserDto,
    UpdateUserDto,
  },
  entities: {
    User,
  },
};

export const auth = {
  dto: {
    RegisterUserDto,
  },
};
