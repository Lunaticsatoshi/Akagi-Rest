import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'
import { Public } from 'src/common/decorators/public.decorator'
import { UserErrors } from 'src/common/enums/errors.enum'
import { LoggerService } from 'src/common/logger/logger.service'
import { createApiResponse } from 'src/common/utils/apiResponse'
import RequestContext from 'src/common/utils/request-context'
import { __prod__, emailRegex } from 'src/constants'

import { UserService } from '../user.service'
import { LoginDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}
  @Public()
  @Post('/generate-email-otp')
  async generateEmailOtp(@Body('email') email: string) {
    const formattedEmail = email.toLowerCase().trim()
    if (formattedEmail && emailRegex.test(formattedEmail)) {
      const existingUser = await this.userService.findOneByEmail(email)

      if (existingUser && existingUser.deletedAt) {
        throw new NotFoundException(UserErrors.AccountDeleted)
      } else {
        const [flag, response] = await this.authService.generateOtp(formattedEmail)
        if (flag) {
          return createApiResponse(200, 'otp generated successfully', { otp: response })
        }
      }
    } else {
      throw new BadRequestException(UserErrors.InvalidEmail)
    }
  }

  @Public()
  @Post('/login-email-otp')
  async loginEmailOtp(@Body('loginData') loginData: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
    const flag = await this.authService.validateOtp(loginData.email, loginData.otp)
    if (flag) {
      const user = await this.userService.findOneByEmail(loginData.email)
      const token = await this.authService.loginUserSession(user)

      response.setCookie('session_token', token, {
        httpOnly: true,
        domain: this.configService.get('sessionDomain'),
        secure: __prod__,
        path: '/',
        sameSite: __prod__ ? 'lax' : 'none',
      })
      return createApiResponse(200, 'otp login success')
    }
  }

  @Get('/logout')
  async logout(@Res({ passthrough: true }) response: FastifyReply) {
    const token = RequestContext.get<string>('authToken')
    await this.authService.destroySessionToken(token)
    response.clearCookie('session_token', {
      httpOnly: true,
      domain: this.configService.get('sessionDomain'),
      secure: __prod__,
      path: '/',
      sameSite: __prod__ ? 'lax' : 'none',
    })
    return createApiResponse(200, 'logout success')
  }
}
