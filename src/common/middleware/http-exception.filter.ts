import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { IErrorResponse } from 'src/common/interfaces/error'
import { LoggerService } from 'src/common/logger/logger.service'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    let status
    let error
    let message
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      error = exception.name
      message = exception.message
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      error = 'Internal Server Error'
      message = exception.message
    }

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
