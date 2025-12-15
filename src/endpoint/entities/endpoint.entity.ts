import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HttpEndpointEnum } from '../types';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: HttpEndpointEnum })
  method: HttpEndpointEnum;
}
