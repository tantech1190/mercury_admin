/**
 * AUDITOR ROUTES
 * CRUD operations for auditors
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auditorController = require('../controllers/auditor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/auditors
// @desc    Get all auditors
// @access  Private
router.get('/', auditorController.getAllAuditors);

// @route   GET /api/auditors/stats
// @desc    Get auditor statistics
// @access  Private
router.get('/stats', auditorController.getAuditorStats);

// @route   GET /api/auditors/:id
// @desc    Get single auditor
// @access  Private
router.get('/:id', 
  param('id').isMongoId().withMessage('Invalid auditor ID'),
  auditorController.getAuditor
);

// @route   POST /api/auditors
// @desc    Create new auditor
// @access  Private (admin, manager)
router.post('/',
  authorize('admin', 'manager'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('circles').isArray({ min: 1 }).withMessage('At least one circle is required')
  ],
  auditorController.createAuditor
);

// @route   PUT /api/auditors/:id
// @desc    Update auditor
// @access  Private (admin, manager)
router.put('/:id',
  authorize('admin', 'manager'),
  param('id').isMongoId().withMessage('Invalid auditor ID'),
  auditorController.updateAuditor
);

// @route   DELETE /api/auditors/:id
// @desc    Delete auditor
// @access  Private (admin only)
router.delete('/:id',
  authorize('admin'),
  param('id').isMongoId().withMessage('Invalid auditor ID'),
  auditorController.deleteAuditor
);

// @route   POST /api/auditors/:id/update-metrics
// @desc    Update auditor performance metrics
// @access  Private
router.post('/:id/update-metrics',
  param('id').isMongoId().withMessage('Invalid auditor ID'),
  auditorController.updateAuditorMetrics
);

module.exports = router;
