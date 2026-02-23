import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    morgan.token('datetime', () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      return `${date} ${time}`;
    });

    morgan.token('methodColor', (req) => {
      const method = req.method;
      switch (method) {
        case 'GET':
          return chalk.blue(method);
        case 'POST':
          return chalk.green(method);
        case 'PUT':
          return chalk.yellow(method);
        case 'DELETE':
          return chalk.red(method);
        default:
          return chalk.white(method);
      }
    });

    morgan.token('status-icon', (req, res) => {
      const status = res.statusCode;

      switch (status) {
        case 200:
          return chalk.green(`🟢 ${status}`);
        case 201:
          return chalk.green(`✅ ${status}`);
        case 204:
          return chalk.cyan(`🟢 ${status}`);
        case 400:
          return chalk.yellow(`😡 ${status}`);
        case 401:
          return chalk.magenta(`⚠️ ${status}`);
        case 403:
          return chalk.redBright(`⛔ ${status}`);
        case 404:
          return chalk.hex('#FFA500')(`❓ ${status}`);
        case 409:
          return chalk.hex('#800080')(`🔒 ${status}`);
        case 500:
          return chalk.red(`💥 ${status}`);
        default:
          if (status >= 500) return chalk.red(`💥 ${status}`);
          if (status >= 400) return chalk.yellow(`⚠️ ${status}`);
          if (status >= 300) return chalk.cyan(`🧩 ${status}`);
          if (status >= 200) return chalk.green(`✅ ${status}`);
          return chalk.white(status);
      }
    });

    morgan(':datetime :methodColor :url :status-icon :response-time ms', {
      stream: process.stdout,
    })(req, res, next);
  }
}
