const express = require('express');
const router = express.Router();
const memberController = require('../controllers/members.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/v1/members
 * @desc Get all members with pagination and filtering
 * @query { page, limit, status, search }
 */
router.get('/', verifyToken, memberController.getAllMembers);

/**
 * @route GET /api/v1/members/:id
 * @desc Get member by ID
 */
router.get('/:id', verifyToken, memberController.getMemberById);

/**
 * @route POST /api/v1/members
 * @desc Create new member
 * @body { firstName, lastName, email, phone, idNumber, dateOfBirth, ... }
 */
router.post('/', verifyToken, requireRole('admin', 'secretary'), memberController.createMember);

/**
 * @route PUT /api/v1/members/:id
 * @desc Update member
 */
router.put('/:id', verifyToken, requireRole('admin', 'secretary'), memberController.updateMember);

/**
 * @route DELETE /api/v1/members/:id
 * @desc Delete member
 */
router.delete('/:id', verifyToken, requireRole('admin'), memberController.deleteMember);

/**
 * @route POST /api/v1/members/import/bulk
 * @desc Import members from CSV
 */
router.post('/import/bulk', verifyToken, requireRole('admin', 'secretary'), memberController.bulkImportMembers);

module.exports = router;
