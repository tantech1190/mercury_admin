/**
 * AUDIT CONTROLLER
 * Handles audit CRUD operations
 */

const { validationResult } = require('express-validator');
const Audit = require('../models/Audit.model');
const Auditor = require('../models/Auditor.model');

// @desc    Get all audits
// @route   GET /api/audits
// @access  Private
exports.getAllAudits = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      auditType,
      circle,
      auditorId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (auditType) query.auditType = auditType;
    if (circle) query.circle = circle;
    if (auditorId) query.auditorId = auditorId;
    if (search) {
      query.$or = [
        { storeCode: { $regex: search, $options: 'i' } },
        { storeName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const audits = await Audit.find(query)
      .populate('auditorId', 'name email circles')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Audit.countDocuments(query);

    res.status(200).json({
      success: true,
      data: audits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit statistics
// @route   GET /api/audits/stats
// @access  Private
exports.getAuditStats = async (req, res, next) => {
  try {
    const stats = await Audit.aggregate([
      {
        $facet: {
          statusDistribution: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          typeDistribution: [
            { $group: { _id: '$auditType', count: { $sum: 1 } } }
          ],
          circleDistribution: [
            { $group: { _id: '$circle', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                avgScore: { $avg: '$score' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive analytics
// @route   GET /api/audits/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await Audit.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single audit
// @route   GET /api/audits/:id
// @access  Private
exports.getAudit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const audit = await Audit.findById(req.params.id)
      .populate('auditorId', 'name email circles phone');

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: audit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new audit
// @route   POST /api/audits
// @access  Private (admin, manager)
exports.createAudit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditData = {
      ...req.body,
      createdBy: req.user._id
    };

    const audit = await Audit.create(auditData);

    // Calculate score if rawData provided
    if (audit.rawData && Object.keys(audit.rawData).length > 0) {
      await audit.calculateScore();
      await audit.save();
    }

    res.status(201).json({
      success: true,
      message: 'Audit created successfully',
      data: audit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update audit
// @route   PUT /api/audits/:id
// @access  Private (admin, manager)
exports.updateAudit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const audit = await Audit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedAudit = await Audit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('auditorId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Audit updated successfully',
      data: updatedAudit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign audit to auditor
// @route   PATCH /api/audits/:id/assign
// @access  Private (admin, manager)
exports.assignAudit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { auditorId } = req.body;

    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const auditor = await Auditor.findById(auditorId);
    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    // Check if auditor's circles include audit's circle
    if (!auditor.circles.includes(audit.circle)) {
      return res.status(400).json({
        success: false,
        message: `Auditor is not assigned to circle: ${audit.circle}`
      });
    }

    audit.auditorId = auditorId;
    audit.auditorName = auditor.name;
    audit.auditorEmail = auditor.email;
    audit.status = 'open';
    audit.updatedBy = req.user._id;

    await audit.save();

    // Update auditor metrics
    await auditor.updatePerformanceMetrics();

    res.status(200).json({
      success: true,
      message: 'Audit assigned successfully',
      data: audit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update audit status
// @route   PATCH /api/audits/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    audit.status = status;
    if (status === 'completed' && !audit.completedAt) {
      audit.completedAt = new Date();
    }
    audit.updatedBy = req.user._id;

    await audit.save();

    // Update auditor metrics if audit has auditor
    if (audit.auditorId) {
      const auditor = await Auditor.findById(audit.auditorId);
      if (auditor) {
        await auditor.updatePerformanceMetrics();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: audit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate and update score
// @route   PATCH /api/audits/:id/calculate-score
// @access  Private
exports.calculateScore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    await audit.calculateScore();
    await audit.save();

    // Update auditor metrics if audit has auditor
    if (audit.auditorId) {
      const auditor = await Auditor.findById(audit.auditorId);
      if (auditor) {
        await auditor.updatePerformanceMetrics();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Score calculated successfully',
      data: {
        id: audit._id,
        score: audit.score,
        scoreBreakdown: audit.scoreBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete audit
// @route   DELETE /api/audits/:id
// @access  Private (admin)
exports.deleteAudit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    const auditorId = audit.auditorId;
    await audit.deleteOne();

    // Update auditor metrics
    if (auditorId) {
      const auditor = await Auditor.findById(auditorId);
      if (auditor) {
        await auditor.updatePerformanceMetrics();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Audit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete audits
// @route   DELETE /api/audits
// @access  Private (admin)
exports.bulkDeleteAudits = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { ids } = req.body;

    const result = await Audit.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} audit(s) deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create audits from Excel upload
// @route   POST /api/audits/bulk
// @access  Private (admin, manager)
exports.bulkCreateAudits = async (req, res, next) => {
  try {
    console.log('📦 Bulk create audits request received');
    console.log('👤 User:', req.user?.email);
    console.log('📊 Audits to create:', req.body.audits?.length);
    
    const { audits } = req.body;
    
    // Validation - ONLY check if it's an array, not field validation
    if (!audits || !Array.isArray(audits)) {
      console.log('❌ Invalid request: audits is not an array');
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Expected array of audits in body.'
      });
    }

    if (audits.length === 0) {
      console.log('❌ Invalid request: empty audits array');
      return res.status(400).json({
        success: false,
        message: 'No audits provided for bulk creation.'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      audits: [],
      errors: []
    };

    // Process each audit - NO VALIDATION, store everything
    for (let i = 0; i < audits.length; i++) {
      try {
        console.log(`\n🔄 [${i + 1}/${audits.length}] Processing audit:`, {
          storeCode: audits[i]?.storeCode,
          storeName: audits[i]?.storeName,
          auditType: audits[i]?.auditType,
          circle: audits[i]?.circle,
          score: audits[i]?.score
        });
        
        const auditData = {
          ...audits[i],
          createdBy: req.user?._id || req.user?.id || 'system',
          status: audits[i].status || 'unassigned'
        };

        // Convert deadline to Date if it's a string
        if (auditData.deadline && typeof auditData.deadline === 'string') {
          auditData.deadline = new Date(auditData.deadline);
        }
        
        // Create audit in database WITHOUT validation
        const audit = await Audit.create(auditData);
        
        results.audits.push(audit);
        results.success++;
        
        console.log(`✅ [${i + 1}/${audits.length}] Created: ${audit.storeCode} - ${audit.storeName} (ID: ${audit._id})`);
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          error: error.message,
          storeCode: audits[i]?.storeCode || 'Unknown',
          storeName: audits[i]?.storeName || 'Unknown',
          fullError: error.toString(),
          validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
            field: key,
            message: error.errors[key].message
          })) : []
        });
        console.error(`❌ [${i + 1}/${audits.length}] Failed:`, error.message);
        console.error(`   Full error:`, error);
        if (error.errors) {
          console.error(`   Validation errors:`, Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`).join(', '));
        }
      }
    }

    console.log('✅ Bulk upload complete:');
    console.log(`   - Success: ${results.success}`);
    console.log(`   - Failed: ${results.failed}`);
    console.log(`   - Total: ${audits.length}`);

    // Return success even if some audits failed
    res.status(201).json({
      success: true,
      data: results,
      message: `Successfully created ${results.success} out of ${audits.length} audits. ${results.failed > 0 ? `Failed: ${results.failed}` : ''}`
    });

  } catch (error) {
    console.error('❌ Bulk create error:', error);
    next(error);
  }
};