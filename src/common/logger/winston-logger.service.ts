import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk = require('chalk');
import winston = require('winston');
import { createHash } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WinstonCloudWatch = require('winston-cloudwatch');

@Injectable()
export class WinstonLogger {
  constructor(private configService: ConfigService) {
    const appName = this.configService.get('appName');
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ];

    if (process.env.NODE_ENV === 'production') {
      transports.push(
        new WinstonCloudWatch({
          name: appName,
          logGroupName: `${appName}-${process.env.STAGE}`,
          logStreamName: function () {
            // Spread log streams across dates as the server stays up
            const date = new Date().toISOString().split('T')[0];
            return (
              'express-server-' +
              date +
              '-' +
              createHash('md5').update(new Date().toISOString()).digest('hex')
            );
          },
          awsRegion: 'ap-south-1',
          jsonMessage: true,
        }),
      );
    }

    winston.loggers.add('access-log', {
      defaultMeta: { service: appName },
      transports,
    });
  }

  private formatter = (options: any) => {
    const message = options.message || '';
    let meta = '';
    if (options.meta && Object.keys(options.meta).length) {
      meta = `\n\t${JSON.stringify(options.meta)}`;
    }

    let level = options.level.toUpperCase();
    switch (level) {
      case 'INFO':
        level = chalk.bgBlue(level);
        break;
      case 'LOG':
        level = chalk.cyan(level);
        break;
      case 'WARN':
        level = chalk.yellow(level);
        break;
      case 'DEBUG':
        level = chalk.bgYellow(level);
        break;
      case 'ERROR':
        level = chalk.bgRed(level);
        break;
      default:
        break;
    }

    let logMessage = `[${options.timestamp()}][${level}]`;
    if (message.length) {
      logMessage += ` ${message}`;
    }
    if (meta.length) {
      logMessage += ` ${meta}`;
    }
    return logMessage;
  };

  public get logger() {
    return winston.loggers.get('access-log');
  }

  check() {
    return 'ok';
  }
}
