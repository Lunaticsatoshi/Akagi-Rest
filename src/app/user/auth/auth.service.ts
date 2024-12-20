import { RedisService } from '@liaoliaots/nestjs-redis'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { getUnixTime } from 'date-fns'
import Redis from 'ioredis'
import { UserErrors } from 'src/common/enums/errors.enum'
import { hashObject } from 'src/common/utils/createHash'
import { convertTimeToUnixTime } from 'src/common/utils/dateTime'
import {
  USER_LOGIN_OTP_CHECK_COUNT_STORE,
  USER_LOGIN_OTP_COUNT_STORE,
  USER_LOGIN_OTP_STORE,
  USER_TOKEN_ID_MAP,
  USER_TOKEN_STORE,
} from 'src/constants'

import { UserEntity } from '../user.entity'

@Injectable()
export class AuthService {
  private readonly redis: Redis
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow()
  }

  async generateOtp(key: string) {
    let otp_request_count = ((await this.redis.get(`${USER_LOGIN_OTP_COUNT_STORE}_${key}`)) || 0) as number

    if (!otp_request_count) {
      otp_request_count = 1
      await this.redis.set(`${USER_LOGIN_OTP_COUNT_STORE}_${key}`, otp_request_count)
      await this.redis.expireat(`${USER_LOGIN_OTP_COUNT_STORE}_${key}`, convertTimeToUnixTime('1 hours'))
    }

    if (otp_request_count > 15) {
      throw new ForbiddenException(UserErrors.OtpLimitExceeded)
    } else {
      await this.redis.incr(`${USER_LOGIN_OTP_COUNT_STORE}_${key}`)
      const otp = Math.floor(100000 + Math.random() * 900000)
      await this.redis.del(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`)
      await this.redis.set(`${USER_LOGIN_OTP_STORE}_${key}`, otp)
      await this.redis.expireat(`${USER_LOGIN_OTP_STORE}_${key}`, convertTimeToUnixTime('10 minutes'))
      return [true, otp]
    }
  }

  async checkOtp(key: string) {
    return await this.redis.get(`${USER_LOGIN_OTP_STORE}_${key}`)
  }

  async validateOtp(key: string, otp: string) {
    let otp_check_count = ((await this.redis.get(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`)) || 0) as number
    if (!otp_check_count) {
      otp_check_count = 1
      await this.redis.set(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`, otp_check_count)
      await this.redis.expireat(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`, convertTimeToUnixTime('10 minutes'))
    }

    if (otp_check_count > 6) {
      throw new ForbiddenException(UserErrors.OtpLimitExceeded)
    } else {
      await this.redis.incr(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`)
      const storedOtp = await this.checkOtp(key)
      if (storedOtp === otp) {
        await this.redis.del(`${USER_LOGIN_OTP_CHECK_COUNT_STORE}_${key}`)
        await this.redis.del(`${USER_LOGIN_OTP_STORE}_${key}`)
        return true
      } else {
        throw new BadRequestException(UserErrors.InvalidOtp)
      }
    }
  }

  async loginUserSession(user: UserEntity) {
    if (!user.isActive || user.deletedAt) {
      throw new NotFoundException(UserErrors.AccountDeleted)
    }
    return await this.generateSessionToken(user)
  }

  async generateSessionToken(user: UserEntity) {
    const entityId = user.entityId
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
      entityId: user.entityId,
      createdAt: user.createdAt.toDateString(),
      updatedAt: user.updatedAt.toDateString(),
      lastSignIn: user.lastSignIn.toDateString(),
      expiresIn: '2 weeks',
      hashTime: getUnixTime(new Date()),
    }
    const token = hashObject(tokenData)
    await this.redis.hset(`${USER_TOKEN_STORE}_${token}`, tokenData)
    await this.redis.expireat(`${USER_TOKEN_STORE}_${token}`, convertTimeToUnixTime('2 weeks'))
    await this.redis.sadd(`${USER_TOKEN_ID_MAP}_${entityId}`, token)
    return token
  }

  async getSessionTokens(entityId: string) {
    return await this.redis.smembers(`${USER_TOKEN_ID_MAP}_${entityId}`)
  }

  async getSessionTokenData(token: string) {
    const tokenData = (await this.redis.hgetall(`${USER_TOKEN_STORE}_${token}`)) || null
    if (tokenData) {
      const expiresIn = tokenData['expiresIn']
      await this.redis.hset(`${USER_TOKEN_STORE}_${token}`, 'expiresIn', '2 weeks')
      await this.redis.expireat(`${USER_TOKEN_STORE}_${token}`, convertTimeToUnixTime(expiresIn))
      return tokenData
    }
  }

  async destroySessionToken(token: string) {
    const tokenData = (await this.redis.hgetall(`${USER_TOKEN_STORE}_${token}`)) || null
    if (tokenData) {
      const entityId = tokenData.entityId
      await this.redis.del(`${USER_TOKEN_STORE}_${token}`)
      await this.redis.srem(`${USER_TOKEN_ID_MAP}_${entityId}`, token)
    }
  }

  async destroySessionTokens(entityId: string) {
    const tokens = await this.getSessionTokens(entityId)
    for (const token of tokens) {
      await this.redis.del(`${USER_TOKEN_STORE}_${token}`)
    }
    await this.redis.del(`${USER_TOKEN_ID_MAP}_${entityId}`)
  }
}
