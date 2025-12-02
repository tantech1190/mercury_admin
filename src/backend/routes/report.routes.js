/**
 * REPORT ROUTES
 * Analytics and reporting endpoints
 */

const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/reports/overview
// @desc    Get overview statistics
// @access  Private
router.get('/overview', reportController.getOverview);

// @route   GET /api/reports/auditor-performance
// @desc    Get auditor performance report
// @access  Private
router.get('/auditor-performance', reportController.getAuditorPerformance);

// @route   GET /api/reports/circle-performance
// @desc    Get circle performance report
// @access  Private
router.get('/circle-performance', reportController.getCirclePerformance);

// @route   GET /api/reports/score-analytics
// @desc    Get score analytics
// @access  Private
router.get('/score-analytics', reportController.getScoreAnalytics);

// @route   GET /api/reports/audit-type-breakdown
// @desc    Get breakdown by audit type
// @access  Private
router.get('/audit-type-breakdown', reportController.getAuditTypeBreakdown);

// @route   GET /api/reports/trending
// @desc    Get trending data over time
// @access  Private
router.get('/trending', reportController.getTrendingData);

// @route   GET /api/reports/export
// @desc    Export report data as CSV/Excel
// @access  Private
router.get('/export',
  [
    query('format').optional().isIn(['csv', 'excel']).withMessage('Format must be csv or excel'),
    query('type').optional().isIn(['audits', 'auditors', 'summary']).withMessage('Invalid export type')
  ],
  reportController.exportReport
);

module.exports = router;
