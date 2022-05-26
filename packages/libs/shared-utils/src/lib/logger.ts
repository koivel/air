import * as Winston from 'winston';
import * as ExpressWinston from 'express-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Handler } from 'express';
import { AirContext } from './air-context';

export class Logger {
  private static logger: Winston.Logger;
  private static epxressLogger: Handler;

  public static info(message: string, ...meta: any[]) {
    Logger.logger.info(message, ...meta);
  }

  public static error(message: string, ...meta: any[]) {
    Logger.logger.error(message, ...meta);
  }

  public static getExpressLogger(): Handler {
    return Logger.epxressLogger;
  }

  public static setupLogger() {
    const esTransportOpts = {
      apm: AirContext.apm,
      level: 'info',
      clientOpts: {
        node: `https://${process.env['ELASTIC_USER']}:${process.env['ELASTIC_PASSWORD']}@${process.env['ELASTIC_HOST']}`,
      },
    };

    const baseFormat = Winston.format.combine(
      Winston.format.errors({ stack: true }),
      Winston.format.timestamp(),
      Winston.format.splat(),
    );

    const consoleFormat = Winston.format.combine(
      Winston.format.errors({ stack: true }),
      Winston.format.splat(),
      Winston.format.colorize(),
      Winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          return `${timestamp} ${level}: ${message} - ${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      })
    );

    Logger.logger = Winston.createLogger({
      format: baseFormat,
      transports: [
        new Winston.transports.Console({ format: consoleFormat }),
        new ElasticsearchTransport(esTransportOpts),
      ],
    });

    Logger.epxressLogger = ExpressWinston.logger({
      format: baseFormat,
      transports: [
        new Winston.transports.Console({ format: consoleFormat }),
        new ElasticsearchTransport(esTransportOpts),
      ],
    });
  }
}
