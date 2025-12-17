const mongoose = require('mongoose');

const galleryDetailSchema = new mongoose.Schema(
  {
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
    },
    imagePaths: {
      type: [String],
      required: true,
      validate: [(arr) => Array.isArray(arr) && arr.length > 0, 'At least one image is required']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryDetail', galleryDetailSchema);
