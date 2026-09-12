const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/dashboard/overview
 * @desc Get dashboard overview data
 */
router.get('/overview', verifyToken, dashboardController.getOverview);

/**
 * @route GET /api/v1/dashboard/metrics
 * @desc Get key metrics
 */
router.get('/metrics', verifyToken, dashboardController.getMetrics);

/**
 * @route GET /api/v1/dashboard/charts
 * @desc Get chart data
 */
router.get('/charts', verifyToken, dashboardController.getChartData);

module.exports = router;
