import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { type ConfigType } from '@nestjs/config';
import { HashingProvider } from 'src/common/hashing/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingProvider: HashingProvider,

    @Inject(authConfig.KEY)
    private readonly authConfigurations: ConfigType<typeof authConfig>,
  ) {}

  private async signToken<T>(userId: number, expireIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfigurations.secret,
        expiresIn: expireIn,
        audience: this.authConfigurations.audience,
        issuer: this.authConfigurations.issuer,
      },
    );
  }

  public async signUp(signUpAuthDto: SignUpAuthDto) {
    await this.userService.create(signUpAuthDto);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
    };
  }

  public async signIn(signInAuthDto: SignInAuthDto) {
    const user = await this.userService.findUserByEmail(signInAuthDto?.email);

    const authUser = await this.hashingProvider.comparePassword(
      signInAuthDto.password,
      user.password,
    );

    if (!authUser) throw new BadRequestException();

    const token = await this.signToken(
      user.id,
      this.authConfigurations.expireIn,
      {
        email: user.email,
      },
    );

    return {
      token,
      message: 'User logged in successfully',
    };
  }
}
