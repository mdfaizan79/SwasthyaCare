import { StatusCodes } from 'http-status-codes';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { emitAppointmentEvent } from '../services/socket.service.js';
import { notifyAppointmentChange } from '../services/notification.service.js';

async function getPatientIdFromUser(userId) {
  const patient = await Patient.findOne({ userId }).select('_id');
  if (!patient) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Patient profile not found');
  }
  return patient._id;
}

async function getDoctorIdFromUser(userId) {
  const doctor = await Doctor.findOne({ userId }).select('_id');
  if (!doctor) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Doctor profile not found');
  }
  return doctor._id;
}

export const createAppointment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient' && req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only patients or admins can book appointments');
  }

  const { doctorId, appointmentDate, timeSlot, department, symptoms, fees } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  let patientId = req.body.patientId;
  if (req.user.role === 'patient') {
    patientId = await getPatientIdFromUser(req.user._id);
  }

  if (!patientId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Patient is required');
  }

  const conflict = await Appointment.findOne({
    doctorId,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    status: { $nin: ['cancelled'] }
  });

  if (conflict) {
    throw new ApiError(StatusCodes.CONFLICT, 'Selected slot is already booked');
  }

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    appointmentDate,
    timeSlot,
    department,
    symptoms,
    fees
  });

  const populated = await Appointment.findById(appointment._id)
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } });

  emitAppointmentEvent('created', { appointmentId: appointment._id, status: appointment.status });

  await notifyAppointmentChange({
    to: populated.doctorId?.userId?.email ?? 'doctor',
    message: `New appointment booked for ${timeSlot}`
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: populated
  });
});

export const getAppointments = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.user.role === 'patient') {
    filter = { patientId: await getPatientIdFromUser(req.user._id) };
  }

  if (req.user.role === 'doctor') {
    filter = { doctorId: await getDoctorIdFromUser(req.user._id) };
  }

  const appointments = await Appointment.find(filter)
    .sort({ appointmentDate: 1 })
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } });

  res.status(StatusCodes.OK).json({
    success: true,
    data: appointments
  });
});

export const getAppointmentsByDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const appointments = await Appointment.find({ doctorId })
    .sort({ appointmentDate: 1 })
    .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
    .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } });

  res.status(StatusCodes.OK).json({
    success: true,
    data: appointments
  });
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }

  if (req.user.role === 'patient') {
    const patientId = await getPatientIdFromUser(req.user._id);
    if (appointment.patientId.toString() !== patientId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only update your appointments');
    }

    const allowed = ['symptoms', 'status'];
    const safePayload = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));

    if (safePayload.status && safePayload.status !== 'cancelled') {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Patients can only cancel appointments');
    }

    Object.assign(appointment, safePayload);
  } else {
    Object.assign(appointment, payload);
  }

  if ((payload.appointmentDate || payload.timeSlot) && appointment.status !== 'cancelled') {
    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: payload.doctorId ?? appointment.doctorId,
      appointmentDate: payload.appointmentDate ?? appointment.appointmentDate,
      timeSlot: payload.timeSlot ?? appointment.timeSlot,
      status: { $nin: ['cancelled'] }
    });

    if (conflict) {
      throw new ApiError(StatusCodes.CONFLICT, 'Updated slot conflicts with another appointment');
    }
  }

  await appointment.save();

  emitAppointmentEvent('updated', { appointmentId: appointment._id, status: appointment.status });

  res.status(StatusCodes.OK).json({
    success: true,
    data: appointment
  });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }

  if (req.user.role === 'patient') {
    const patientId = await getPatientIdFromUser(req.user._id);
    if (appointment.patientId.toString() !== patientId.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only cancel your appointments');
    }
  }

  appointment.status = 'cancelled';
  await appointment.save();

  emitAppointmentEvent('cancelled', { appointmentId: appointment._id, status: appointment.status });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Appointment cancelled'
  });
});
