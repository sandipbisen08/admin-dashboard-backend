const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { userUpdateValidator } = require('../middleware/validators');

// Apply protect and authorize middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', userUpdateValidator, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', userController.deleteUser);

module.exports = router;
