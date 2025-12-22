import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

export class isAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request['payload'];
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new UnauthorizedException("You don't have access to use this!!!");
    if (user?.role?.name !== 'Admin') return false;
    return true;
  }
}
