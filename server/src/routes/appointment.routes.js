import { Router } from 'express';
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  getAppointmentsByDoctor,
  updateAppointment
} from '../controllers/appointments.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointment.validators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createAppointmentSchema), createAppointment);
router.get('/', getAppointments);
router.put('/:id', validate(updateAppointmentSchema), updateAppointment);
router.delete('/:id', cancelAppointment);
router.get('/doctor/:doctorId', getAppointmentsByDoctor);

export default router;
