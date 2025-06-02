import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ObjectId } from 'mongodb';

import uploadConfig from '@config/upload';

@Entity('users')
class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'string' })
  name: string;

  @Column({ type: 'string' })
  email: string;

  @Column({ type: 'string' })
  @Exclude()
  password: string;

  @Column({ type: 'string', nullable: true })
  avatar: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) return this.avatar;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
