import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 5 })
  password: string;

  @ApiProperty({ type: () => CreateRoleDto })
  @IsNotEmpty()
  @IsObject()
  role: Role;
}
