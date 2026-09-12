const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @body { email, password, firstName, lastName, role }
 */
router.post('/register', authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @body { email, password }
 */
router.post('/login', authController.login);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 */
router.get('/me', verifyToken, authController.getCurrentUser);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh JWT token
 */
router.post('/refresh', authController.refreshToken);

module.exports = router;
