import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Post } from '@repo/api/posts/entities/post.entity';
import { User } from '@repo/api/users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof Post> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

const postRestrictionReason = 'User is not the author of the Post';

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    can(Action.Read, Post);
    can(Action.Update, Post, { authorId: { $eq: user.id } });
    can(Action.Delete, Post, { authorId: { $eq: user.id } });

    cannot(Action.Update, Post).because(postRestrictionReason);
    cannot(Action.Delete, Post).because(postRestrictionReason);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
