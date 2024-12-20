import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { createApiResponse } from 'src/common/utils/apiResponse'

import { CreateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    skipMissingProperties: true,
    transform: true,
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/hello')
  hello() {
    throw new Error('hello')
  }

  @Get('/')
  async findAll() {
    const users = await this.userService.findAll()
    createApiResponse(200, 'success', { data: users })
  }

  @Get('/:id')
  async findOneById(@Body('id') id: number) {
    const user = await this.userService.findOneById(id)
    createApiResponse(200, 'success', { data: user })
  }

  @Post('/create')
  async create(@Body('user') userData: CreateUserDto) {
    const user = await this.userService.createUser(userData)
    createApiResponse(200, 'user-creation-success', { data: user })
  }
}
