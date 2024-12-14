import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
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
    return this.userService.getHello();
  }
}
