import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HttpEndpointEnum } from '../types';

export class CreateEndpointDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsEnum(HttpEndpointEnum, {
    message: 'method must be GET, POST, PATCH or DELETE',
  })
  method: HttpEndpointEnum;
}
