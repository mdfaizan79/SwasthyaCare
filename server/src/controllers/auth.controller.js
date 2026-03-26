import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  compareRefreshToken,
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../services/token.service.js';
import { sendPasswordResetEmail } from '../services/notification.service.js';
import env from '../config/env.js';

function buildAuthPayload(user) {
  return {
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  };
}

async function issueTokens(user) {
  const payload = buildAuthPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshTokenHash = await hashRefreshToken(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
}

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    specialization,
    department,
    consultationFee,
    dateOfBirth,
    gender,
    bloodGroup,
    allergies
  } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role,
    phone: phone ?? ''
  });

  if (role === 'doctor') {
    await Doctor.create({
      userId: user._id,
      specialization: specialization || 'General Practice',
      department: department || 'General Medicine',
      consultationFee: consultationFee || 0
    });
  }

  if (role === 'patient') {
    await Patient.create({
      userId: user._id,
      dateOfBirth: dateOfBirth ?? null,
      gender: gender ?? '',
      bloodGroup: bloodGroup ?? '',
      allergies: allergies ?? []
    });
  }

  const tokens = await issueTokens(user);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      ...tokens
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const tokens = await issueTokens(user);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      ...tokens
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(StatusCodes.OK).json({ success: true, message: 'Logged out' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if (user) {
      user.refreshTokenHash = null;
      await user.save();
    }
  } catch {
    // Silently ignore invalid refresh token on logout.
  }

  res.status(StatusCodes.OK).json({ success: true, message: 'Logged out' });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const isValidRefresh = await compareRefreshToken(refreshToken, user.refreshTokenHash);
  if (!isValidRefresh) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const tokens = await issueTokens(user);

  res.status(StatusCodes.OK).json({
    success: true,
    data: tokens
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    const resetUrl = `${env.appUrl}/auth/reset-password?userId=${user._id}&token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'If the email exists, a password reset link has been sent.'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, token, newPassword } = req.body;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const record = await PasswordResetToken.findOne({
    userId,
    tokenHash,
    expiresAt: { $gt: new Date() }
  });

  if (!record) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired reset token');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.refreshTokenHash = null;
  await user.save();

  await PasswordResetToken.deleteMany({ userId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successful'
  });
});
