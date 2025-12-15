import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AllowPermissionDto } from './dto/allow-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  public async allow(@Body() allowPermissionDto: AllowPermissionDto) {
    return await this.permissionService.allow(allowPermissionDto);
  }
}
