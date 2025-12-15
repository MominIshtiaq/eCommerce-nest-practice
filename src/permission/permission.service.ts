import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { AllowPermissionDto } from './dto/allow-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  public async allow(allowPermissionDto: AllowPermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: {
        roleName: allowPermissionDto.roleName,
        endpointId: allowPermissionDto.endpointId,
      },
    });

    if (!permission) throw new NotFoundException('permission not found');

    permission.isAllow = allowPermissionDto.isAllow;

    return await this.permissionRepository.save(permission);
  }
}
