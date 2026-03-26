import { Router } from 'express';
import { getDoctorById, getDoctors, getProfile, updateProfile } from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validators.js';

const router = Router();

router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
