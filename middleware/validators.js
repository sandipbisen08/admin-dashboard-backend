const { check } = require('express-validator');

exports.registerValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.userUpdateValidator = [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Please enter a password with 6 or more characters').optional().isLength({ min: 6 })
];

exports.homepageDetailsValidator = [
  check('headerTitle', 'Header title is required').not().isEmpty(),
  check('headerTitle', 'Header title must be at most 120 characters').isLength({ max: 120 }),
  check('headerDesc', 'Header description is required').not().isEmpty(),
  check('headerDesc', 'Header description must be at most 2000 characters').isLength({ max: 2000 })
];

exports.aboutDetailsValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('title', 'Title must be at most 120 characters').isLength({ max: 120 }),
  check('description', 'Description is required').not().isEmpty(),
  check('description', 'Description must be at most 5000 characters').isLength({ max: 5000 })
];

exports.galleryDetailsValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('title', 'Title must be at most 120 characters').isLength({ max: 120 }),
  check('description', 'Description is required').not().isEmpty(),
  check('description', 'Description must be at most 5000 characters').isLength({ max: 5000 })
];

exports.ahvalDetailsValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('title', 'Title must be at most 120 characters').isLength({ max: 120 }),
  check('description', 'Description is required').not().isEmpty(),
  check('description', 'Description must be at most 5000 characters').isLength({ max: 5000 })
];

exports.leaderDetailsValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'Name must be at most 120 characters').isLength({ max: 120 }),
  check('description', 'Description is required').not().isEmpty(),
  check('description', 'Description must be at most 5000 characters').isLength({ max: 5000 }),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('phone', 'Phone number must be at most 30 characters').isLength({ max: 30 }),
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email must be at most 254 characters').isLength({ max: 254 })
];
