import { CanActivate, ExecutionContext } from '@nestjs/common';

export class isAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
}
