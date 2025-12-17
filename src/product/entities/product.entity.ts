import slugify from 'slugify';
import { Category } from 'src/category/entities/category.entity';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortDescription: string;

  @Column({ nullable: true, default: '' })
  longDescription: string;

  @Column()
  price: number;

  @Column({ nullable: true, default: 0 })
  offerPrice: number;

  @Column()
  quantity: number;

  @Column()
  slug: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    const date = new Date();
    this.slug = slugify(`${this.name}-${date.getTime()}`);
  }
}
