import slugify from 'slugify';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    const date = new Date();
    this.slug = `${slugify(this.name)}-${date.getTime()}`;
  }
}
