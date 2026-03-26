import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  patientId: Joi.string().optional(),
  doctorId: Joi.string().required(),
  appointmentDate: Joi.date().required(),
  timeSlot: Joi.string().required(),
  department: Joi.string().required(),
  symptoms: Joi.string().allow('').default(''),
  fees: Joi.number().min(0).default(0)
});

export const updateAppointmentSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'in-progress', 'completed', 'cancelled').optional(),
  symptoms: Joi.string().optional(),
  prescription: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
  fees: Joi.number().min(0).optional(),
  appointmentDate: Joi.date().optional(),
  timeSlot: Joi.string().optional(),
  department: Joi.string().optional()
}).min(1);
