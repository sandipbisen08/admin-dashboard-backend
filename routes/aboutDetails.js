const express = require('express');
const router = express.Router();

const aboutDetailsController = require('../controllers/aboutDetailsController');
const { protect, authorize } = require('../middleware/auth');
const { aboutDetailsValidator } = require('../middleware/validators');
const { uploadAboutImage } = require('../middleware/upload');

router.use(protect);

router.get('/', aboutDetailsController.list);
router.post('/', authorize('admin'), uploadAboutImage, aboutDetailsValidator, aboutDetailsController.create);
router.put('/:id', authorize('admin'), uploadAboutImage, aboutDetailsValidator, aboutDetailsController.update);
router.delete('/:id', authorize('admin'), aboutDetailsController.remove);

module.exports = router;
