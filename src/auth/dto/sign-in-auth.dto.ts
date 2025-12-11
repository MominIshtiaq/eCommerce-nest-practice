import { PickType } from '@nestjs/mapped-types';
import { SignUpAuthDto } from './sign-up-auth.dto';

export class SignInAuthDto extends PickType(SignUpAuthDto, [
  'email',
  'password',
]) {}
