import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Auth => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user;

    
    if (_data && _data.permId) {
      const indexNumber = user.role.permissions.findIndex((permission: number) => _data.permId.includes(permission));
      if(indexNumber == -1) {
        throw new ForbiddenException();
      }
    }
    
    return req.user;
  },
);
