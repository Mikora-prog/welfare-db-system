const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/users
 * @desc Get all users
 */
router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID
 */
router.get('/:id', verifyToken, userController.getUserById);

/**
 * @route PUT /api/v1/users/:id
 * @desc Update user
 */
router.put('/:id', verifyToken, userController.updateUser);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete user
 */
router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUser);

module.exports = router;
