import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshTokenHash');

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  let roleProfile = null;

  if (user.role === 'doctor') {
    roleProfile = await Doctor.findOne({ userId: user._id });
  }

  if (user.role === 'patient') {
    roleProfile = await Patient.findOne({ userId: user._id });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user,
      roleProfile
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, doctorProfile, patientProfile } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = { ...user.address.toObject?.(), ...address };
  await user.save();

  if (user.role === 'doctor' && doctorProfile) {
    await Doctor.findOneAndUpdate({ userId: user._id }, doctorProfile, {
      new: true,
      upsert: true
    });
  }

  if (user.role === 'patient' && patientProfile) {
    await Patient.findOneAndUpdate({ userId: user._id }, patientProfile, {
      new: true,
      upsert: true
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Profile updated successfully'
  });
});

export const getDoctors = asyncHandler(async (req, res) => {
  const { department, specialization } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (specialization) filter.specialization = specialization;

  const doctors = await Doctor.find(filter)
    .populate({
      path: 'userId',
      select: 'name email phone isActive'
    })
    .lean();

  const activeDoctors = doctors.filter((doctor) => doctor.userId?.isActive !== false);

  res.status(StatusCodes.OK).json({
    success: true,
    data: activeDoctors
  });
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate({
      path: 'userId',
      select: 'name email phone isActive'
    })
    .lean();

  if (!doctor || !doctor.userId || doctor.userId.isActive === false) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: doctor
  });
});
