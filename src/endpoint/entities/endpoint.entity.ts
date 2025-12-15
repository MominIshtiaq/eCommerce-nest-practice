import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HttpEndpointEnum } from '../types';
import { Permission } from 'src/permission/entities/permission.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: HttpEndpointEnum })
  method: HttpEndpointEnum;

  @OneToMany(() => Permission, (permission) => permission.endpoint)
  permissions: Permission[];
}
