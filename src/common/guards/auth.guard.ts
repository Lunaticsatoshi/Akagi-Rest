import { RedisService } from '@liaoliaots/nestjs-redis'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { getEnvVariable } from 'src/common/utils/env'
import { IS_PUBLIC_KEY, USER_TOKEN_STORE } from 'src/constants'

import RequestContext from '../utils/request-context'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly redis: Redis
  constructor(
    private readonly redisService: RedisService,
    private reflector: Reflector,
  ) {
    this.redis = this.redisService.getOrThrow()
  }

  private extractTokenFromHeader(req: FastifyRequest): string | undefined {
    const authToken = (req.cookies['session_token'] || req.headers['session_token']) as string
    const mimicId = (req.cookies['x-mimic-user-id'] || req.headers['x-mimic-user-id']) as string

    return authToken || mimicId || undefined
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Unauthorized user')
    }

    const user = await this.redis.hgetall(`${USER_TOKEN_STORE}_${token}`)
    const canAccess = Object.keys(user).length > 0
    if (canAccess) {
      RequestContext.set('user', user)
      RequestContext.set('authToken', token)
    }
    return canAccess
  }
}

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const API_KEY = getEnvVariable('API_KEY')
    const gqlContext = context.getArgByIndex(2)
    const apiKey = RequestContext.get('x-api-key') || gqlContext?.extra?.apiKey
    return apiKey === API_KEY
  }
}
