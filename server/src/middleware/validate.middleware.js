import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

export default function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Validation failed',
          error.details.map((item) => item.message)
        )
      );
    }

    req[source] = value;
    return next();
  };
}
