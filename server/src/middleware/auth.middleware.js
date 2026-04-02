import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../services/token.service.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization ?? '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' ||  !token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired access token');
  }

  const user = await User.findById(payload.sub).select('-password -refreshTokenHash');

  if (!user || !user.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found or inactive');
  }

  req.user = user;
  next();
  
});

export function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions'));
    }

    return next();
  };
}
