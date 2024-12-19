import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { IErrorResponse } from 'src/common/interfaces/error'
import { LoggerService } from 'src/common/logger/logger.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    const status = exception.getStatus()
    const error = exception.name
    const message = exception.message

    const responseJSON: IErrorResponse = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    this.loggerService.error(message, { exception })

    response.status(status).send(responseJSON)
  }
}
