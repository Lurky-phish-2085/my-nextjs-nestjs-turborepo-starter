import { Exclude } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  @Exclude()
  currentHashedRefreshToken?: string | null;

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];
}
