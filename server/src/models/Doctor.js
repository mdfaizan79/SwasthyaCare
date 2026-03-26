import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    specialization: {
      type: String,
      default: 'General Practice',
      trim: true
    },
    qualifications: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    department: {
      type: String,
      default: 'General Medicine',
      trim: true,
      index: true
    },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' }
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0
    },
    availability: {
      type: [
        {
          day: { type: String, required: true },
          slots: { type: [String], default: [] }
        }
      ],
      default: []
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.index({ department: 1, specialization: 1 });

export default mongoose.model('Doctor', doctorSchema);
