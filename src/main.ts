import { NestFactory } from '@nestjs/core'
const { fastifyRequestContextPlugin } = require('@fastify/request-context')
import fastifyCookie from '@fastify/cookie'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { LoggerService } from './common/logger/logger.service'
import { HttpExceptionFilter } from './common/middleware/http-exception.filter'
import { setContext } from './common/middleware/setContext'

function formatErroText(appName: string, err: any): string {
  let errorText = `[${appName}] Uncaught Exception: `
  if (err && err?.response && err?.response?.data) {
    // http exceptions
    errorText += JSON.stringify(err.response.data)
  } else {
    // standard exceptions
    errorText += err?.message + err?.stack
  }
  return errorText
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))
  const config = app.get(ConfigService)
  const appName = config.get('appName')

  console.log(process.env.ENV_FILE)

  app.register(fastifyRequestContextPlugin)
  await app.register(fastifyCookie, {
    secret: config.get<string>('cookieSecret'), // for cookies signature
  })

  app.enableCors({
    allowedHeaders:
      'X-Requested-With, Content-Type, Origin, Authorization, Accept, x-auth-token, x-portal-token, Accept-Encoding, X-Total-Count, Link, OtpRefId, x-client-id, x-session-id, x-correlation-id, x-timezone-id, x-device-id, x-login-pin, x-accessible-corporates,x-selected-corporate,x-force-regenerate,x-include-cash,x-include-claim, x-stats-only, x-include-none',
    exposedHeaders:
      'X-Requested-With, Content-Type, Origin, Authorization, Accept, x-auth-token, x-portal-token, Accept-Encoding, X-Total-Count, Link, X-last-record-date,x-accessible-corporates,x-selected-corporate,x-force-regenerate,x-include-cash,x-include-claim, x-stats-only,  x-include-none',
    methods: 'POST, PUT, GET, DELETE, PATCH, HEAD',
    credentials: true,
  })
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV !== 'development' }))
  // app.use(httpContext.middleware);
  app.use(setContext(appName))
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
      skipMissingProperties: true,
      transform: true,
    }),
  )

  const logger = app.get(LoggerService)
  app.useGlobalFilters(new HttpExceptionFilter(logger))

  process.on('unhandledRejection', (err: any) => {
    const errorText: string = formatErroText(appName, err)
    logger.error(errorText)
  })
  process.on('uncaughtException', (err: any) => {
    const errorText: string = formatErroText(appName, err)
    logger.error(errorText)
  })

  await app.listen(3006)
  logger.info(`App listening on port 3006`)
}

bootstrap()
