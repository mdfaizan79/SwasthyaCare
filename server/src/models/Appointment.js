import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    symptoms: {
      type: String,
      default: ''
    },
    prescription: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    fees: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

export default mongoose.model('Appointment', appointmentSchema);
