import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthEntity } from '../../auth/entity/auth.entity';

export const extractUser = (request): AuthEntity => request['auth'];

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? extractUser(request)['data'] : extractUser(request);
  },
);
