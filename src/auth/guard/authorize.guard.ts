import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import authConfig from '../config/auth.config';
import { type ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (!token) {
      throw new UnauthorizedException('Unauthorized user');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.authConfiguration,
      );

      request['payload'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
