import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
    (_data, context: ExecutionContext) => {
      const ctx = GqlExecutionContext.create(context);
  
      const user = ctx.getContext().req.user;
     
      if (_data ) {
        const indexNumber = user.role?.permissions.findIndex((permission: number) => _data.permId.includes(permission));

        if(!user.role) {
          throw new ForbiddenException();
        } else if (indexNumber == -1) {
          throw new ForbiddenException();
        }
          
      }
  
      return user;
    },
  );