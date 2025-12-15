import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AllowPermissionDto {
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsNotEmpty()
  @IsBoolean()
  isAllow: boolean;

  @IsNotEmpty()
  @IsNumber()
  endpointId: number;
}
