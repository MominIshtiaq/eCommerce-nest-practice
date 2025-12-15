import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { isAdminGuard } from './guard/is-admin.guard';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('role')
@UseGuards(isAdminGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  public async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  public async findAll(@Query() paginationDto: PaginationDto) {
    return await this.roleService.findAll(paginationDto);
  }

  @Patch(':name')
  public async updateRole(
    @Param('name') name: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.update(name, updateRoleDto);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteRole(@Param('name') name: string) {
    return await this.roleService.delete(name);
  }
}
