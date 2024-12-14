import { Entity, Column, Index } from 'typeorm';
import { IsEmail, Length } from 'class-validator';

import BaseEntity from '../../entities/base.entity';

export enum AUTH_TYPE {
  EMAIL_AND_PASSWORD = 'EMAIL_AND_PASSWORD',
  GOOGLE = 'GOOGLE',
}

export class GoogleData {
  iss: string;

  sub: string;

  hd: string;

  email: string;

  emailVerified: boolean;

  name: string;

  picture: string;
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: 'Must be a valid email address' })
  @Length(1, 255, { message: 'Email is empty' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: 'Must be at least 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    default: AUTH_TYPE.EMAIL_AND_PASSWORD,
    enum: AUTH_TYPE,
  })
  authType: AUTH_TYPE;

  @Column({ nullable: true })
  profileImageUrn?: string;

  profileImageUrl: string;

  @Column({ default: false, type: 'boolean' })
  status: boolean;

  @Column({ default: false, type: 'boolean' })
  emailVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  googleData: GoogleData;
}
