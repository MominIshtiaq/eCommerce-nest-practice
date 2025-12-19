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

  @Column({ nullable: true })
  image: string;

  @Column()
  shortDescription: string;

  @Column({ type: 'text', nullable: true, default: '' })
  longDescription: string;

  // precision : 10 => total digits
  // scale : 2 => digits after decimal
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // precision : 10 => total digits
  // scale : 2 => digits after decimal
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
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
