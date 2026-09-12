const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/reports/financial
 * @desc Get financial summary report
 */
router.get('/financial', verifyToken, requireRole('admin', 'treasurer', 'secretary'), reportController.getFinancialReport);

/**
 * @route GET /api/v1/reports/members
 * @desc Get member statistics report
 */
router.get('/members', verifyToken, requireRole('admin', 'secretary'), reportController.getMemberReport);

/**
 * @route GET /api/v1/reports/payments
 * @desc Get payment collection report
 */
router.get('/payments', verifyToken, requireRole('admin', 'treasurer'), reportController.getPaymentReport);

/**
 * @route GET /api/v1/reports/outstanding
 * @desc Get outstanding payments report
 */
router.get('/outstanding', verifyToken, requireRole('admin', 'treasurer'), reportController.getOutstandingReport);

/**
 * @route GET /api/v1/reports/export/pdf
 * @desc Export report as PDF
 */
router.get('/export/pdf', verifyToken, reportController.exportPDF);

/**
 * @route GET /api/v1/reports/export/excel
 * @desc Export report as Excel
 */
router.get('/export/excel', verifyToken, reportController.exportExcel);

module.exports = router;
