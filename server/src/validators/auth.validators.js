import Joi from 'joi';

const roles = ['patient', 'doctor', 'admin'];

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid(...roles).required(),
  phone: Joi.string().allow('', null),
  specialization: Joi.string().allow('', null),
  department: Joi.string().allow('', null),
  consultationFee: Joi.number().min(0).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().allow('', null),
  bloodGroup: Joi.string().allow('', null),
  allergies: Joi.array().items(Joi.string()).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});
