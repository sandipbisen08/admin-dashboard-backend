const path = require('path');
const multer = require('multer');

const homepageUploadDir = path.join(__dirname, '..', 'uploads', 'homepage');
const aboutUploadDir = path.join(__dirname, '..', 'uploads', 'about');
const galleryUploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
const ahvalUploadDir = path.join(__dirname, '..', 'uploads', 'ahval');
const leadersUploadDir = path.join(__dirname, '..', 'uploads', 'leaders');

const createStorage = (destDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const safeExt = path.extname(file.originalname || '').toLowerCase();
      const base = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${base}${safeExt}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'));
};

const uploadHomepageImage = multer({
  storage: createStorage(homepageUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('image');

const uploadAboutImage = multer({
  storage: createStorage(aboutUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('image');

const uploadGalleryImages = multer({
  storage: createStorage(galleryUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array('images', 20);

const uploadAhvalImage = multer({
  storage: createStorage(ahvalUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('image');

const uploadLeaderImage = multer({
  storage: createStorage(leadersUploadDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('image');

module.exports = {
  uploadHomepageImage,
  uploadAboutImage,
  uploadGalleryImages,
  uploadAhvalImage,
  uploadLeaderImage,
};
