import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AllowPermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isAllow: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  endpointId: number;
}
