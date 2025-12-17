const express = require('express');
const router = express.Router();

const homepageDetailsController = require('../controllers/homepageDetailsController');
const { protect, authorize } = require('../middleware/auth');
const { homepageDetailsValidator } = require('../middleware/validators');
const { uploadHomepageImage } = require('../middleware/upload');

router.use(protect);

router.get('/', homepageDetailsController.list);
router.post('/', authorize('admin'), uploadHomepageImage, homepageDetailsValidator, homepageDetailsController.create);
router.put('/:id', authorize('admin'), uploadHomepageImage, homepageDetailsValidator, homepageDetailsController.update);
router.delete('/:id', authorize('admin'), homepageDetailsController.remove);

module.exports = router;
