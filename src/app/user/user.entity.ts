import { Entity, Column, Index } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import BaseEntity from '../../entities/base.entity';

export enum AUTH_TYPE {
  EMAIL_AND_PASSWORD = 'EMAIL_AND_PASSWORD',
  GOOGLE = 'GOOGLE',
}

registerEnumType(AUTH_TYPE, {
  name: 'authType',
  description: 'Type of the authentication method used',
});

@ObjectType()
export class GoogleData {
  @Field()
  iss: string;

  @Field()
  sub: string;

  @Field()
  hd: string;

  @Field()
  email: string;

  @Field()
  emailVerified: boolean;

  @Field()
  name: string;

  @Field()
  picture: string;
}

@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity {
  @Field()
  @Index()
  @IsEmail(undefined, { message: 'Must be a valid email address' })
  @Length(1, 255, { message: 'Email is empty' })
  @Column({ unique: true })
  email: string;

  @Field()
  @Index()
  @Length(3, 255, { message: 'Must be at least 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Field(() => AUTH_TYPE)
  @Column({
    type: 'enum',
    default: AUTH_TYPE.EMAIL_AND_PASSWORD,
    enum: AUTH_TYPE,
  })
  authType: AUTH_TYPE;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageUrn?: string;

  @Field({
    defaultValue: 'https://via.placeholder.com/200/000000/FFFFFF/?text=LL',
    nullable: true,
  })
  profileImageUrl: string;

  @Field()
  @Column({ default: false, type: 'boolean' })
  status: boolean;

  @Field()
  @Column({ default: false, type: 'boolean' })
  emailVerified: boolean;

  @Field({ nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  googleData: GoogleData;
}
