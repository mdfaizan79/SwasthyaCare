import winston from 'winston';
import env from './env.js';

const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}] ${stack ?? message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

export default logger;
