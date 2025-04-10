import { Link } from 'links/entities/link.entity';

import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { CreatePostDto } from 'posts/dto/create-post.dto';
import { UpdatePostDto } from 'posts/dto/update-post.dto';
import { Post } from 'posts/entities/post.entity';

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

export * from './posts/entities/post.entity';
