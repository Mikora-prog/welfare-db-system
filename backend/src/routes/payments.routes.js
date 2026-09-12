const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/payments
 * @desc Get all payments with filtering
 */
router.get('/', verifyToken, paymentController.getAllPayments);

/**
 * @route GET /api/v1/payments/:id
 * @desc Get payment by ID
 */
router.get('/:id', verifyToken, paymentController.getPaymentById);

/**
 * @route POST /api/v1/payments
 * @desc Record new payment
 */
router.post('/', verifyToken, requireRole('admin', 'treasurer'), paymentController.recordPayment);

/**
 * @route PUT /api/v1/payments/:id
 * @desc Update payment
 */
router.put('/:id', verifyToken, requireRole('admin', 'treasurer'), paymentController.updatePayment);

/**
 * @route DELETE /api/v1/payments/:id
 * @desc Delete payment
 */
router.delete('/:id', verifyToken, requireRole('admin'), paymentController.deletePayment);

/**
 * @route GET /api/v1/payments/member/:memberId
 * @desc Get payment history for a member
 */
router.get('/member/:memberId', verifyToken, paymentController.getMemberPaymentHistory);

/**
 * @route POST /api/v1/payments/:id/verify
 * @desc Verify payment
 */
router.post('/:id/verify', verifyToken, requireRole('admin', 'treasurer'), paymentController.verifyPayment);

/**
 * @route GET /api/v1/payments/:id/receipt
 * @desc Get payment receipt
 */
router.get('/:id/receipt', verifyToken, paymentController.getReceipt);

module.exports = router;
