const express = require('express');
const router = express.Router();
const dependantBenefitsController = require('../controllers/dependant-benefits.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/dependant-benefits
 * @desc Get all dependant benefits with filtering
 * @query { dependantId, status, page, limit }
 */
router.get('/', verifyToken, dependantBenefitsController.getAllBenefits);

/**
 * @route GET /api/v1/dependant-benefits/:id
 * @desc Get benefit by ID
 */
router.get('/:id', verifyToken, dependantBenefitsController.getBenefitById);

/**
 * @route POST /api/v1/dependant-benefits
 * @desc Create new benefit for dependant
 * @body { dependantId, benefitType, amount, benefitDate, expiryDate, ... }
 */
router.post('/', verifyToken, requireRole('admin', 'treasurer'), dependantBenefitsController.createBenefit);

/**
 * @route PUT /api/v1/dependant-benefits/:id
 * @desc Update benefit
 */
router.put('/:id', verifyToken, requireRole('admin', 'treasurer'), dependantBenefitsController.updateBenefit);

/**
 * @route DELETE /api/v1/dependant-benefits/:id
 * @desc Delete benefit
 */
router.delete('/:id', verifyToken, requireRole('admin'), dependantBenefitsController.deleteBenefit);

/**
 * @route GET /api/v1/dependant-benefits/dependant/:dependantId
 * @desc Get all benefits for a dependant
 */
router.get('/dependant/:dependantId', verifyToken, dependantBenefitsController.getDependantBenefits);

module.exports = router;
