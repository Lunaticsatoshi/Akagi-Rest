import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const { fastifyRequestContextPlugin } = require('@fastify/request-context')
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
// import helmet = require('helmet');
import { ConfigService } from '@nestjs/config'
import { setContext } from './common/middleware/setContext'
import { LoggerService } from './common/logger/logger.service'
import { parseToken } from './common/middleware/firebase-token-parser'
import { ValidationPipe, VersioningType } from '@nestjs/common'

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
  const config = app.get(ConfigService)
  const appName = config.get('appName')

  console.log(process.env.ENV_FILE)

  app.register(fastifyRequestContextPlugin)

  app.enableCors({
    allowedHeaders:
      'X-Requested-With, Content-Type, Origin, Authorization, Accept, x-auth-token, x-portal-token, Accept-Encoding, X-niyoappApp-error, X-niyoappApp-params, X-niyoappApp-exceptionCode, X-Total-Count, Link, X-niyoappApp-alert, OtpRefId, x-client-id, x-session-id, x-correlation-id, x-timezone-id, x-device-id, x-login-pin, x-accessible-corporates,x-selected-corporate,x-force-regenerate,x-include-cash,x-include-claim, x-stats-only, x-include-none',
    exposedHeaders:
      'X-Requested-With, Content-Type, Origin, Authorization, Accept, x-auth-token, x-portal-token, Accept-Encoding, X-niyoappApp-error, X-niyoappApp-params, X-niyoappApp-exceptionCode, X-Total-Count, Link, X-niyoappApp-alert, X-last-record-date,x-accessible-corporates,x-selected-corporate,x-force-regenerate,x-include-cash,x-include-claim, x-stats-only,  x-include-none',
    methods: 'POST, PUT, GET, DELETE, PATCH, HEAD',
  })
  // app.use(
  //   helmet({ contentSecurityPolicy: process.env.NODE_ENV !== 'development' }),
  // );
  // app.use(httpContext.middleware);
  app.use(setContext(appName))
  app.use(parseToken)

  const logger = app.get(LoggerService)
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
