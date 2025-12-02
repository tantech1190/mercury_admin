/**
 * UPLOAD ROUTES
 * Excel file upload and parsing
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload.middleware');

// All routes require authentication
router.use(protect);

// @route   POST /api/upload/excel
// @desc    Upload and parse Excel file
// @access  Private (admin, manager)
router.post('/excel',
  authorize('admin', 'manager'),
  upload.single('file'),
  handleUploadError,
  uploadController.uploadExcel
);

// @route   GET /api/upload/template/:type
// @desc    Download Excel template
// @access  Private
router.get('/template/:type', uploadController.downloadTemplate);

module.exports = router;
