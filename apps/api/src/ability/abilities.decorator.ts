import { SetMetadata } from '@nestjs/common';
import { Post } from '@repo/api/posts/entities/post.entity';
import { Action, Subjects } from './ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export const ReadPostAbility: RequiredRule = {
  action: Action.Read,
  subject: Post,
};

export const UpdatePostAbility: RequiredRule = {
  action: Action.Update,
  subject: Post,
};

export const DeletePostAbility: RequiredRule = {
  action: Action.Delete,
  subject: Post,
};
