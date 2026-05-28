import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";

// 포스트의 상태 구분 Enum
export enum PostStatus {
  DRAFT     = 'DRAFT',
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

  @ManyToOne(() => Category, category => category.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  category!: Category;

  @Column()
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
