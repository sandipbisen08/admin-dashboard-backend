const express = require('express');
const router = express.Router();

const leaderDetailsController = require('../controllers/leaderDetailsController');
const { protect, authorize } = require('../middleware/auth');
const { leaderDetailsValidator } = require('../middleware/validators');
const { uploadLeaderImage } = require('../middleware/upload');

router.use(protect);

// view
router.get('/:role', leaderDetailsController.getByRole);

// create or update (admin)
router.put('/:role', authorize('admin'), uploadLeaderImage, leaderDetailsValidator, leaderDetailsController.upsertByRole);

// delete (admin)
router.delete('/:role', authorize('admin'), leaderDetailsController.removeByRole);

module.exports = router;
