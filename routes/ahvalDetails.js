const express = require('express');
const router = express.Router();

const ahvalDetailsController = require('../controllers/ahvalDetailsController');
const { protect, authorize } = require('../middleware/auth');
const { ahvalDetailsValidator } = require('../middleware/validators');
const { uploadAhvalImage } = require('../middleware/upload');

router.use(protect);

router.get('/', ahvalDetailsController.list);
router.post('/', authorize('admin'), uploadAhvalImage, ahvalDetailsValidator, ahvalDetailsController.create);
router.put('/:id', authorize('admin'), uploadAhvalImage, ahvalDetailsValidator, ahvalDetailsController.update);
router.delete('/:id', authorize('admin'), ahvalDetailsController.remove);

module.exports = router;
