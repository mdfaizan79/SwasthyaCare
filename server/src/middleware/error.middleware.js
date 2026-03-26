import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';

export function notFound(_req, _res, next) {
  const err = new Error('Route not found');
  err.statusCode = StatusCodes.NOT_FOUND;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message ?? 'Internal server error';

  logger.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details ?? null
  });
}
