import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
