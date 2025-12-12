import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserInterface } from '../interface/current-user.interface';

export const CurrentUser = createParamDecorator(
  (
    field: keyof CurrentUserInterface | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    const payload: CurrentUserInterface = request.payload;
    return field ? payload[field] : payload;
  },
);
