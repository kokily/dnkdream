import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column('simple-array', { nullable: true })
  tags!: string[];

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status!: PostStatus;

  @Column({ nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category!: Category | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}