import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HttpEndpointEnum } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEndpointDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(HttpEndpointEnum, {
    message: 'method must be GET, POST, PATCH or DELETE',
  })
  method: HttpEndpointEnum;
}
