import Joi from 'joi';

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
  
});
