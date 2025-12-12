import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PaginationModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
