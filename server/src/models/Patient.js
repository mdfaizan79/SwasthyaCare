import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      default: ''
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relation: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    medicalHistory: {
      type: [
        {
          condition: String,
          diagnosedAt: Date,
          notes: String
        }
      ],
      default: []
    },
    bloodGroup: {
      type: String,
      default: ''
    },
    allergies: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Patient', patientSchema);
