import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 5 })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 5 })
  newPassword: string;
}
