import { PickType } from '@nestjs/swagger';
import { SignUpAuthDto } from './sign-up-auth.dto';

export class SignInAuthDto extends PickType(SignUpAuthDto, [
  'email',
  'password',
]) {}
