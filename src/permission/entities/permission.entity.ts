import { Endpoint } from 'src/endpoint/entities/endpoint.entity';
import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

// The RoleName and EndpointId are composite keys. and also is the method to create composite key.
// Now the roleName and endpointId is the primary and foreign keys.

@Entity()
export class Permission {
  @PrimaryColumn()
  roleName: string;

  @PrimaryColumn()
  endpointId: number;

  @ManyToOne(() => Role, (role) => role.name)
  @JoinColumn({ name: 'roleName', referencedColumnName: 'name' })
  role: Role;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.id)
  @JoinColumn({ name: 'endpointId', referencedColumnName: 'id' })
  endpoint: Endpoint;

  @Column({ type: 'boolean', default: false })
  isAllow: boolean;
}
