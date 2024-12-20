import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  getHello() {
    return 'Hello World!'
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id })
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email })
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const createdUser = await this.usersRepository.create(user)
    return await this.usersRepository.save(createdUser)
  }
}
