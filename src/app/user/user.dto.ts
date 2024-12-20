import { IsEmail, IsEnum, IsString } from 'class-validator'

import { USER_TYPE } from './user.entity'

export class CreateUserDto {
  @IsString()
  username: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsEnum(USER_TYPE)
  userType: USER_TYPE
}
