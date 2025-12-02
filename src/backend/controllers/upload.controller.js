/**
 * UPLOAD CONTROLLER
 * Handles file uploads and Excel parsing
 */

const fs = require('fs').promises;
const path = require('path');
const Audit = require('../models/Audit.model');
const Auditor = require('../models/Auditor.model');
const { parseExcelFile } = require('../utils/excelParser');

// @desc    Upload and parse Excel file
// @route   POST /api/upload/excel
// @access  Private (admin, manager)
exports.uploadExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel file'
      });
    }

    const filePath = req.file.path;

    // Parse Excel file
    const parseResult = parseExcelFile(filePath);

    if (!parseResult.success) {
      // Clean up file
      await fs.unlink(filePath).catch(() => {});
      
      return res.status(400).json({
        success: false,
        message: 'Failed to parse Excel file',
        error: parseResult.error
      });
    }

    // Save audits to database
    const savedAudits = [];
    const errors = [];

    for (const auditData of parseResult.audits) {
      try {
        // Find or create auditor if email provided
        if (auditData.auditorEmail) {
          const auditor = await Auditor.findOne({ email: auditData.auditorEmail });
          if (auditor) {
            auditData.auditorId = auditor._id;
          }
        }

        auditData.createdBy = req.user._id;
        auditData.uploadedFile = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          uploadDate: new Date(),
          fileSize: req.file.size
        };

        const audit = await Audit.create(auditData);
        
        // Calculate score if rawData exists
        if (audit.rawData && Object.keys(audit.rawData).length > 0) {
          await audit.calculateScore();
          await audit.save();
        }

        savedAudits.push(audit);
      } catch (error) {
        errors.push({
          audit: auditData.storeName || auditData.storeCode,
          error: error.message
        });
      }
    }

    // Update auditor metrics for all affected auditors
    const affectedAuditors = [...new Set(savedAudits.map(a => a.auditorId).filter(Boolean))];
    for (const auditorId of affectedAuditors) {
      const auditor = await Auditor.findById(auditorId);
      if (auditor) {
        await auditor.updatePerformanceMetrics();
      }
    }

    res.status(201).json({
      success: true,
      message: `${savedAudits.length} audit(s) uploaded successfully`,
      data: {
        auditType: parseResult.auditType,
        totalRows: parseResult.totalRows,
        successfulRows: savedAudits.length,
        failedRows: errors.length,
        audits: savedAudits,
        errors: errors.length > 0 ? errors : undefined,
        fileInfo: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// @desc    Download Excel template
// @route   GET /api/upload/template/:type
// @access  Private
exports.downloadTemplate = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!['store', 'ilms', 'xfe'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template type. Must be: store, ilms, or xfe'
      });
    }

    // Template headers for each audit type
    const templates = {
      store: [
        'Timestamp', 'Auditor Name', 'Email Address', 'Circle', 'Store Code', 'Store Name',
        'Location', 'City', 'Pincode', 'Month', 'Year', 'Score',
        'Were you greeted when entered the store?', 'Was the store floor clean?',
        'Was the Glow Sign Board clean and intact?', 'Was the CRO polite?',
        'Did the CRO explain the process clearly?', 'Were you approached for new connection?',
        'Was the branding matching with lookbook?', 'Please rate your overall experience?'
      ],
      ilms: [
        'Timestamp', 'Auditor Name', 'Email Address', 'Circle', 'Location', 'Month', 'Year', 'Score',
        'Web Inquiry Date', 'Web Inquiry Time', 'Advisor Name', 'Advisor Contact',
        'Did you receive call within 15 minutes?', 'Did Airtel advisor introduce himself?',
        'Did Airtel advisor greet you politely?', 'Ambassador Name', 'Visit Date', 'Visit Time',
        'Was Ambassador wearing standard uniform?', 'Did Ambassador probe your telecom needs?',
        'Please rate your overall experience?'
      ],
      xfe: [
        'Timestamp', 'Auditor Name', 'Email Address', 'Circle', 'Location', 'Month', 'Year', 'Score',
        'XFE Name', 'XFE Number', 'Call Date', 'Call Time',
        'Were you able to connect with XFE?', 'Did Airtel XFE introduce himself?',
        'Did Airtel XFE greet you politely?', 'Did XFE ask questions to understand requirement?',
        'Did XFE inform about the process?', 'Was the tone polite?',
        'Please rate your overall experience?'
      ]
    };

    const headers = templates[type];

    // Create CSV content
    const csvContent = headers.join(',') + '\n';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=mercury_${type}_audit_template.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
