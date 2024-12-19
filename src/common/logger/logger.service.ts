import _ = require('lodash')
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import RequestContext from '../utils/request-context'
import { WinstonLogger } from './winston-logger.service'

interface ISlackNotificationUrls {
  topups: string
  directOrders: string
  offboardings: string
  errorsNotificationChannel: string
}

/** @export
 * @class CloudwatchLogger
 * @extends {Logger}
 */
@Injectable()
export class LoggerService extends Logger {
  slackNotificationUrls: ISlackNotificationUrls
  constructor(
    private winstonLogger: WinstonLogger,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    super()
    this.slackNotificationUrls = this.configService.get('slackInternalNotificationUrls')
  }

  private formatError = (error: any) => {
    if (!error) {
      return {}
    }

    if (typeof error === 'string') {
      return {
        error,
      }
    }

    return {
      error: {
        message: error.message,
        stack: error.stack,
      },
    }
  }
  /**
   *
   *
   * @private
   * @type {*}
   * @memberof CloudwatchLogger
   */

  /**
   *
   * Attaches info to the log message/data sent
   * Info contains the app name from config and the correlation id
   * @private
   * @param {*} data
   * @memberof CloudwatchLogger
   */
  private getData = (data: any): Array<any> => {
    const [shortMessage, longMessage, extraInfo] = data
    const correlationId = RequestContext.get('correlationId')
    const user: { uid: string } = RequestContext.get('user')
    const info = {
      correlationId,
      uid: user?.uid,
    }
    // if only data object if provided
    if (_.isPlainObject(shortMessage)) {
      return ['', _.assign({}, { ...shortMessage, ...this.formatError(shortMessage.error) }, info)]
    }
    // if a short message and data object is provided
    if (_.isPlainObject(longMessage)) {
      return [shortMessage, _.assign({}, { ...longMessage, ...this.formatError(longMessage.error) }, info)]
    }
    // if short, long message and data object provided
    if (_.isPlainObject(extraInfo)) {
      return [shortMessage, longMessage, _.assign({}, { ...extraInfo, ...this.formatError(extraInfo.error) }, info)]
    }
    return [...data, info]
  }
  /**
   *
   * Streams logs to graylog based on the isEnabled flag
   * @private
   * @param {string} level
   * @param {...any[]} data
   * @memberof CloudwatchLogger
   */
  private logHandler = (level: string, data: any[]) => {
    try {
      const processedData: Array<any> = this.getData(data)
      this.winstonLogger.logger[level](...processedData, (err: Error) => {
        if (err) {
          console.error(err)
        }
      })

      if (level === 'error' && process.env.NODE_ENV !== 'development') {
        // this.httpService
        //   .post(this.slackNotificationUrls.errorsNotificationChannel, {
        //     text: `Error occurred in Akagi \n\n ${JSON.stringify(
        //       processedData,
        //       null,
        //       4,
        //     )}`,
        //   })
        //   .subscribe();
      }
    } catch (error) {
      console.error(error)
    }
  }

  info(...message: any) {
    this.logHandler('info', message)
  }
  error(...message: any) {
    this.logHandler('error', message)
  }
  debug(...message: any) {
    this.logHandler('debug', message)
  }
}
