/**
 * AUDIT ROUTES
 * CRUD operations for audits
 */

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const auditController = require('../controllers/audit.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/audits
// @desc    Get all audits with filtering and pagination
// @access  Private
router.get('/', auditController.getAllAudits);

// @route   GET /api/audits/stats
// @desc    Get audit statistics
// @access  Private
router.get('/stats', auditController.getAuditStats);

// @route   GET /api/audits/analytics
// @desc    Get comprehensive analytics
// @access  Private
router.get('/analytics', auditController.getAnalytics);

// @route   GET /api/audits/:id
// @desc    Get single audit
// @access  Private
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid audit ID'),
  auditController.getAudit
);

// @route   POST /api/audits
// @desc    Create new audit
// @access  Private (admin, manager)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('storeCode').trim().notEmpty().withMessage('Store code is required'),
    body('storeName').trim().notEmpty().withMessage('Store name is required'),
    body('circle').notEmpty().withMessage('Circle is required'),
    body('auditType').isIn(['store', 'ilms', 'xfe']).withMessage('Invalid audit type'),
    body('deadline').isISO8601().withMessage('Valid deadline is required')
  ],
  auditController.createAudit
);

// @route   POST /api/audits/bulk
// @desc    Bulk create audits from Excel upload (NO VALIDATION)
// @access  Private (admin, manager)
router.post('/bulk',
  authorize('admin', 'manager'),
  auditController.bulkCreateAudits
);

// @route   PUT /api/audits/:id
// @desc    Update audit
// @access  Private (admin, manager)
router.put('/:id',
  authorize('admin', 'manager'),
  param('id').isMongoId().withMessage('Invalid audit ID'),
  auditController.updateAudit
);

// @route   PATCH /api/audits/:id/assign
// @desc    Assign audit to auditor
// @access  Private (admin, manager)
router.patch('/:id/assign',
  authorize('admin', 'manager'),
  [
    param('id').isMongoId().withMessage('Invalid audit ID'),
    body('auditorId').isMongoId().withMessage('Invalid auditor ID')
  ],
  auditController.assignAudit
);

// @route   PATCH /api/audits/:id/status
// @desc    Update audit status
// @access  Private
router.patch('/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid audit ID'),
    body('status').isIn(['unassigned', 'open', 'in-progress', 'at-risk', 'completed']).withMessage('Invalid status')
  ],
  auditController.updateStatus
);

// @route   PATCH /api/audits/:id/calculate-score
// @desc    Calculate and update audit score
// @access  Private
router.patch('/:id/calculate-score',
  param('id').isMongoId().withMessage('Invalid audit ID'),
  auditController.calculateScore
);

// @route   DELETE /api/audits/:id
// @desc    Delete audit
// @access  Private (admin only)
router.delete('/:id',
  authorize('admin'),
  param('id').isMongoId().withMessage('Invalid audit ID'),
  auditController.deleteAudit
);

// @route   DELETE /api/audits
// @desc    Bulk delete audits
// @access  Private (admin only)
router.delete('/',
  authorize('admin'),
  body('ids').isArray({ min: 1 }).withMessage('Provide array of audit IDs'),
  auditController.bulkDeleteAudits
);

module.exports = router;