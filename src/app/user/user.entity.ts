import { IsEmail, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator'
import { Column, Entity, Index, UpdateDateColumn } from 'typeorm'

import BaseEntity from '../../entities/base.entity'

export enum AUTH_TYPE {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export enum USER_TYPE {
  AGENCY_USER = 'AGENCY',
  CLIENT_USER = 'CLIENT',
}

export class GoogleData {
  iss: string

  sub: string

  hd: string

  email: string

  emailVerified: boolean

  name: string

  picture: string
}

export class SourceDetails {
  @IsString()
  ipAddress: string

  @IsString()
  userAgent: string

  @IsString()
  initialReferrer: string

  @IsString()
  referrer: string

  @IsString()
  utmSource: string

  @IsString()
  utmMedium: string

  @IsString()
  utmCampaign: string

  @IsString()
  utmContent: string
}

export class Address {
  @IsString()
  address1?: string

  @IsString()
  address2?: string

  @IsString()
  city?: string

  @IsString()
  state?: string

  @IsString()
  country?: string

  @IsNumber()
  pincode?: string
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: 'Must be a valid email address' })
  @Length(1, 255, { message: 'Email is empty' })
  @Column({ unique: true })
  email: string

  @IsString()
  @Column({ nullable: true })
  firstName?: string

  @IsString()
  @Column({ nullable: true })
  lastName?: string

  @Index()
  @Length(3, 255, { message: 'Must be at least 3 characters long' })
  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  countryCode?: string

  @IsPhoneNumber(undefined, { message: 'Must be a valid phone number' })
  @Column({ unique: true, nullable: true })
  phoneNumber?: string

  @Column({ nullable: true })
  password?: string

  @Column({
    type: 'enum',
    default: AUTH_TYPE.EMAIL,
    enum: AUTH_TYPE,
  })
  authType: AUTH_TYPE

  @Column({
    type: 'enum',
    default: USER_TYPE.CLIENT_USER,
    enum: USER_TYPE,
  })
  userType: USER_TYPE

  @Column({ nullable: true })
  avatarUrn?: string

  @Column({ nullable: true })
  avatarUrl?: string

  @Column({ default: false, type: 'boolean' })
  emailVerified: boolean

  @Column({ default: false, type: 'boolean' })
  phoneVerified: boolean

  @Column({ default: false, type: 'boolean' })
  onboarded: boolean

  @Column({ default: false, type: 'boolean' })
  isInvited: boolean

  @Column({ type: 'jsonb', nullable: true })
  sourceDetails?: SourceDetails

  @Column({ type: 'jsonb', nullable: true })
  googleData?: GoogleData

  @Column({ type: 'jsonb', nullable: true })
  address?: Address

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  lastSignIn: Date
}
