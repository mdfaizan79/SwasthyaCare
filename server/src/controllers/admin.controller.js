import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const users = await User.find(filter).select('-password -refreshTokenHash').sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: users
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password -refreshTokenHash');

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    data: user
  });
});

export const getAllAppointments = asyncHandler(async (_req, res) => {
  const appointments = await Appointment.find({})
    .sort({ createdAt: -1 })
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } });

  res.status(StatusCodes.OK).json({
    success: true,
    data: appointments
  });
});

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [users, appointments, doctors, patients, appointmentsByStatus, appointmentsByDepartment] = await Promise.all([
    User.countDocuments(),
    Appointment.countDocuments(),
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    Appointment.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      totals: {
        users,
        appointments,
        doctors,
        patients
      },
      appointmentsByStatus,
      appointmentsByDepartment
    }
  });
});
