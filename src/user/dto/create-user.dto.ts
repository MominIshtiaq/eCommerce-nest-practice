import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 5 })
  password: string;

  @IsNotEmpty()
  @IsObject()
  role: Role;
}
