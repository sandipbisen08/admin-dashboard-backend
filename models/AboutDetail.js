const mongoose = require('mongoose');

const aboutDetailSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
      required: true,
      trim: true
    },
    title: {
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutDetail', aboutDetailSchema);
