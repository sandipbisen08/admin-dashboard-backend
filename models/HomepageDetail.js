const mongoose = require('mongoose');

const homepageDetailSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
      required: true,
      trim: true
    },
    headerTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    headerDesc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageDetail', homepageDetailSchema);
