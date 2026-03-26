import { Router } from 'express';
import {
  getAllAppointments,
  getAnalytics,
  getUsers,
  updateUserStatus
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { updateUserStatusSchema } from '../validators/admin.validators.js';

const router = Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/users', getUsers);
router.put('/users/:id', validate(updateUserStatusSchema), updateUserStatus);
router.get('/appointments', getAllAppointments);
router.get('/analytics', getAnalytics);

export default router;
