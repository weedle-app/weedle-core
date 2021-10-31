import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthEntity } from '../../auth/entity/auth.entity';

export const extractUser = (request): { auth_id: string; email: string } =>
  request['auth'];

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request:', extractUser(request));
    return data ? extractUser(request)[data] : extractUser(request);
  },
);
