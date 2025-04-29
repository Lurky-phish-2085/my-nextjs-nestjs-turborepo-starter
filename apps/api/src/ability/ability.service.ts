import { ForbiddenError } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@repo/api/users/entities/user.entity';
import { AbilityFactory, Action, Subjects } from './ability.factory';

@Injectable()
export class AbilityService {
  constructor(private readonly abilityFactory: AbilityFactory) {}

  checkAbility(action: Action, subject: Subjects, user: User) {
    try {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
    } catch (error) {
      if (!(error instanceof ForbiddenError)) {
        throw new InternalServerErrorException();
      }

      throw new ForbiddenException(error.message);
    }
  }
}
