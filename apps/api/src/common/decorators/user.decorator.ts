import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
