import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpires });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpires });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export async function hashRefreshToken(token) {
  return bcrypt.hash(token, 12);
}

export async function compareRefreshToken(token, hash) {
  if (!hash) return false;
  return bcrypt.compare(token, hash);
}
