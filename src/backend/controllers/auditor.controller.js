/**
 * AUDITOR CONTROLLER
 * Handles auditor CRUD operations
 */

const { validationResult } = require('express-validator');
const Auditor = require('../models/Auditor.model');
const Audit = require('../models/Audit.model');

// @desc    Get all auditors
// @route   GET /api/auditors
// @access  Private
exports.getAllAuditors = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, search, circle, isActive } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (circle) {
      query.circles = circle;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const auditors = await Auditor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Auditor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: auditors,
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

// @desc    Get auditor statistics
// @route   GET /api/auditors/stats
// @access  Private
exports.getAuditorStats = async (req, res, next) => {
  try {
    const stats = await Auditor.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalAuditors: { $sum: 1 },
                activeAuditors: {
                  $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                avgScore: { $avg: '$averageScore' },
                totalAuditsAssigned: { $sum: '$totalAuditsAssigned' },
                totalAuditsCompleted: { $sum: '$totalAuditsCompleted' }
              }
            }
          ],
          byCircle: [
            { $unwind: '$circles' },
            {
              $group: {
                _id: '$circles',
                count: { $sum: 1 },
                avgScore: { $avg: '$averageScore' }
              }
            },
            { $sort: { count: -1 } }
          ],
          topPerformers: [
            { $match: { averageScore: { $gt: 0 } } },
            { $sort: { averageScore: -1 } },
            { $limit: 10 },
            {
              $project: {
                name: 1,
                email: 1,
                averageScore: 1,
                totalAuditsCompleted: 1,
                circles: 1
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

// @desc    Get single auditor
// @route   GET /api/auditors/:id
// @access  Private
exports.getAuditor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditor = await Auditor.findById(req.params.id);

    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    // Get auditor's recent audits
    const recentAudits = await Audit.find({ auditorId: auditor._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('storeCode storeName auditType status score deadline');

    res.status(200).json({
      success: true,
      data: auditor,
      recentAudits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new auditor
// @route   POST /api/auditors
// @access  Private (admin, manager)
exports.createAuditor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditorData = {
      ...req.body,
      createdBy: req.user._id
    };

    const auditor = await Auditor.create(auditorData);

    res.status(201).json({
      success: true,
      message: 'Auditor created successfully',
      data: auditor
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Auditor with this email already exists'
      });
    }
    next(error);
  }
};

// @desc    Update auditor
// @route   PUT /api/auditors/:id
// @access  Private (admin, manager)
exports.updateAuditor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditor = await Auditor.findById(req.params.id);

    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedAuditor = await Auditor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Auditor updated successfully',
      data: updatedAuditor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete auditor
// @route   DELETE /api/auditors/:id
// @access  Private (admin)
exports.deleteAuditor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditor = await Auditor.findById(req.params.id);

    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    // Check if auditor has assigned audits
    const assignedAudits = await Audit.countDocuments({ auditorId: auditor._id, status: { $ne: 'completed' } });

    if (assignedAudits > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete auditor. They have ${assignedAudits} pending audit(s).`
      });
    }

    await auditor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Auditor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update auditor performance metrics
// @route   POST /api/auditors/:id/update-metrics
// @access  Private
exports.updateAuditorMetrics = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditor = await Auditor.findById(req.params.id);

    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    // Update metrics
    await auditor.updatePerformanceMetrics();

    res.status(200).json({
      success: true,
      message: 'Performance metrics updated successfully',
      data: auditor
    });
  } catch (error) {
    next(error);
  }
};
