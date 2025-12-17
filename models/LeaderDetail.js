const mongoose = require('mongoose');

const leaderDetailSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['sarpanch', 'upsarpanch', 'gramsevak'],
      unique: true
    },
    imagePath: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaderDetail', leaderDetailSchema);
