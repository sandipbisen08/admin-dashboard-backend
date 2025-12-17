const express = require('express');
const router = express.Router();

const galleryDetailsController = require('../controllers/galleryDetailsController');
const { protect, authorize } = require('../middleware/auth');
const { galleryDetailsValidator } = require('../middleware/validators');
const { uploadGalleryImages } = require('../middleware/upload');

router.use(protect);

router.get('/', galleryDetailsController.list);
router.post('/', authorize('admin'), uploadGalleryImages, galleryDetailsValidator, galleryDetailsController.create);
router.put('/:id', authorize('admin'), uploadGalleryImages, galleryDetailsValidator, galleryDetailsController.update);
router.delete('/:id', authorize('admin'), galleryDetailsController.remove);

module.exports = router;
