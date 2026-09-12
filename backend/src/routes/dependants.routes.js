const express = require('express');
const router = express.Router();
const dependantsController = require('../controllers/dependants.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/dependants
 * @desc Get all dependants with filtering
 * @query { memberId, page, limit, relationship, isBeneficiary }
 */
router.get('/', verifyToken, dependantsController.getAllDependants);

/**
 * @route GET /api/v1/dependants/:id
 * @desc Get dependant by ID
 */
router.get('/:id', verifyToken, dependantsController.getDependantById);

/**
 * @route POST /api/v1/dependants
 * @desc Create new dependant
 * @body { memberId, firstName, lastName, relationship, ... }
 */
router.post('/', verifyToken, requireRole('admin', 'secretary'), dependantsController.createDependant);

/**
 * @route PUT /api/v1/dependants/:id
 * @desc Update dependant
 */
router.put('/:id', verifyToken, requireRole('admin', 'secretary'), dependantsController.updateDependant);

/**
 * @route DELETE /api/v1/dependants/:id
 * @desc Delete dependant
 */
router.delete('/:id', verifyToken, requireRole('admin'), dependantsController.deleteDependant);

/**
 * @route GET /api/v1/dependants/member/:memberId
 * @desc Get all dependants for a member
 */
router.get('/member/:memberId', verifyToken, dependantsController.getMemberDependants);

module.exports = router;
