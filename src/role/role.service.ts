import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async checkRoleExist(name: string) {
    let role: Role | null = null;
    role = await this.roleRepository.findOne({ where: { name } });
    return !!role;
  }

  public async findRole(name: string) {
    try {
      let role: Role | null = null;
      role = await this.roleRepository.findOne({ where: { name } });
      if (!role) throw new NotFoundException();
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException();
    }
  }

  public async create(createRoleDto: CreateRoleDto) {
    try {
      const isExistingRole = await this.checkRoleExist(createRoleDto.name);

      if (isExistingRole) {
        throw new BadRequestException();
      }

      const role = this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);

      return {
        data: role,
        message: 'Role created successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  public async findAll(paginationDto: PaginationDto) {
    return await this.paginationProvider.paginateQuery(
      paginationDto,
      this.roleRepository,
    );
  }

  public async update(name: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findRole(name);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  public async delete(name: string) {
    const role = await this.findRole(name);
    try {
      await this.roleRepository.delete(role.name);
      return {
        message: `Record deleted successfully`,
      };
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException({
          description: `Cannot delete role "${name}" because it is assigned to one or more users.`,
        });
      }

      throw new InternalServerErrorException();
    }
  }
}
