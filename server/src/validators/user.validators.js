import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  phone: Joi.string().allow(''),
  address: Joi.object({
    line1: Joi.string().allow(''),
    line2: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string().allow('')
  }),
  doctorProfile: Joi.object({
    specialization: Joi.string().allow(''),
    qualifications: Joi.array().items(Joi.string()),
    experience: Joi.number().min(0),
    department: Joi.string().allow(''),
    consultationFee: Joi.number().min(0),
    workingHours: Joi.object({
      start: Joi.string().allow(''),
      end: Joi.string().allow('')
    }),
    availability: Joi.array().items(
      Joi.object({
        day: Joi.string().required(),
        slots: Joi.array().items(Joi.string()).default([])
      })
    )
  }),
  patientProfile: Joi.object({
    dateOfBirth: Joi.date().allow(null),
    gender: Joi.string().allow(''),
    bloodGroup: Joi.string().allow(''),
    allergies: Joi.array().items(Joi.string()),
    emergencyContact: Joi.object({
      name: Joi.string().allow(''),
      relation: Joi.string().allow(''),
      phone: Joi.string().allow('')
    })
  })
});
