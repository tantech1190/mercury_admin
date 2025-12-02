/**
 * REPORT CONTROLLER
 * Handles analytics and reporting
 */

const Audit = require('../models/Audit.model');
const Auditor = require('../models/Auditor.model');

// @desc    Get overview statistics
// @route   GET /api/reports/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
  try {
    const overview = await Audit.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalAudits: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
                unassigned: { $sum: { $cond: [{ $eq: ['$status', 'unassigned'] }, 1, 0] } },
                atRisk: { $sum: { $cond: [{ $eq: ['$status', 'at-risk'] }, 1, 0] } },
                avgScore: { $avg: '$score' }
              }
            }
          ],
          byType: [
            { $group: { _id: '$auditType', count: { $sum: 1 } } }
          ],
          byCircle: [
            { $group: { _id: '$circle', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          deadlines: [
            {
              $match: {
                status: { $ne: 'completed' },
                deadline: { $exists: true }
              }
            },
            {
              $project: {
                daysUntil: {
                  $divide: [
                    { $subtract: ['$deadline', new Date()] },
                    1000 * 60 * 60 * 24
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                overdue: { $sum: { $cond: [{ $lt: ['$daysUntil', 0] }, 1, 0] } },
                dueThisWeek: { $sum: { $cond: [
                  { $and: [{ $gte: ['$daysUntil', 0] }, { $lte: ['$daysUntil', 7] }] },
                  1, 0
                ] } }
              }
            }
          ]
        }
      }
    ]);

    const auditorStats = await Auditor.aggregate([
      {
        $group: {
          _id: null,
          totalAuditors: { $sum: 1 },
          activeAuditors: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...overview[0],
        auditors: auditorStats[0] || { totalAuditors: 0, activeAuditors: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get auditor performance report
// @route   GET /api/reports/auditor-performance
// @access  Private
exports.getAuditorPerformance = async (req, res, next) => {
  try {
    const auditors = await Auditor.find({ isActive: true })
      .select('name email circles totalAuditsAssigned totalAuditsCompleted averageScore scoreBreakdown')
      .sort({ averageScore: -1 });

    // Get detailed audit data for each auditor
    const performanceData = await Promise.all(
      auditors.map(async (auditor) => {
        const audits = await Audit.find({ auditorId: auditor._id });
        
        const completed = audits.filter(a => a.status === 'completed').length;
        const inProgress = audits.filter(a => a.status === 'in-progress').length;
        const open = audits.filter(a => a.status === 'open').length;
        
        const completionRate = auditor.totalAuditsAssigned > 0
          ? Math.round((completed / auditor.totalAuditsAssigned) * 100)
          : 0;
        
        return {
          id: auditor._id,
          name: auditor.name,
          email: auditor.email,
          circles: auditor.circles,
          totalAssigned: auditor.totalAuditsAssigned,
          completed,
          inProgress,
          open,
          completionRate,
          averageScore: auditor.averageScore,
          scoreBreakdown: auditor.scoreBreakdown
        };
      })
    );

    res.status(200).json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get circle performance report
// @route   GET /api/reports/circle-performance
// @access  Private
exports.getCirclePerformance = async (req, res, next) => {
  try {
    const circleData = await Audit.aggregate([
      {
        $group: {
          _id: '$circle',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avgScore: { $avg: '$score' },
          storeCount: { $sum: { $cond: [{ $eq: ['$auditType', 'store'] }, 1, 0] } },
          ilmsCount: { $sum: { $cond: [{ $eq: ['$auditType', 'ilms'] }, 1, 0] } },
          xfeCount: { $sum: { $cond: [{ $eq: ['$auditType', 'xfe'] }, 1, 0] } }
        }
      },
      {
        $project: {
          circle: '$_id',
          total: 1,
          completed: 1,
          completionRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
            ]
          },
          avgScore: { $round: ['$avgScore', 1] },
          breakdown: {
            store: '$storeCount',
            ilms: '$ilmsCount',
            xfe: '$xfeCount'
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: circleData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get score analytics
// @route   GET /api/reports/score-analytics
// @access  Private
exports.getScoreAnalytics = async (req, res, next) => {
  try {
    const scoreData = await Audit.aggregate([
      {
        $match: { score: { $exists: true, $ne: null } }
      },
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                avgScore: { $avg: '$score' },
                minScore: { $min: '$score' },
                maxScore: { $max: '$score' },
                count: { $sum: 1 }
              }
            }
          ],
          byType: [
            {
              $group: {
                _id: '$auditType',
                avgScore: { $avg: '$score' },
                count: { $sum: 1 }
              }
            }
          ],
          byCircle: [
            {
              $group: {
                _id: '$circle',
                avgScore: { $avg: '$score' },
                count: { $sum: 1 }
              }
            },
            { $sort: { avgScore: -1 } },
            { $limit: 10 }
          ],
          distribution: [
            {
              $bucket: {
                groupBy: '$score',
                boundaries: [0, 50, 60, 70, 80, 90, 100],
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                  avgScore: { $avg: '$score' }
                }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: scoreData[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get breakdown by audit type
// @route   GET /api/reports/audit-type-breakdown
// @access  Private
exports.getAuditTypeBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Audit.aggregate([
      {
        $group: {
          _id: '$auditType',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $ne: ['$status', 'completed'] }, 1, 0] } },
          avgScore: { $avg: '$score' }
        }
      },
      {
        $project: {
          auditType: '$_id',
          total: 1,
          completed: 1,
          pending: 1,
          completionRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$completed', '$total'] }, 100] }, 1] }
            ]
          },
          avgScore: { $round: ['$avgScore', 1] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending data
// @route   GET /api/reports/trending
// @access  Private
exports.getTrendingData = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trending = await Audit.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avgScore: { $avg: '$score' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: trending
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export report data
// @route   GET /api/reports/export
// @access  Private
exports.exportReport = async (req, res, next) => {
  try {
    const { format = 'csv', type = 'audits' } = req.query;

    let data;
    let headers;
    let filename;

    if (type === 'audits') {
      data = await Audit.find()
        .populate('auditorId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
      
      headers = ['Store Code', 'Store Name', 'Type', 'Circle', 'Status', 'Score', 'Auditor', 'Deadline'];
      filename = 'audits_export';
    } else if (type === 'auditors') {
      data = await Auditor.find().lean();
      
      headers = ['Name', 'Email', 'Circles', 'Total Assigned', 'Completed', 'Avg Score'];
      filename = 'auditors_export';
    }

    // Create CSV
    const csvRows = [headers.join(',')];
    
    if (type === 'audits') {
      data.forEach(audit => {
        csvRows.push([
          audit.storeCode,
          `"${audit.storeName}"`,
          audit.auditType,
          audit.circle,
          audit.status,
          audit.score || '',
          audit.auditorId ? audit.auditorId.name : '',
          audit.deadline.toISOString().split('T')[0]
        ].join(','));
      });
    } else if (type === 'auditors') {
      data.forEach(auditor => {
        csvRows.push([
          `"${auditor.name}"`,
          auditor.email,
          `"${auditor.circles.join(', ')}"`,
          auditor.totalAuditsAssigned,
          auditor.totalAuditsCompleted,
          auditor.averageScore
        ].join(','));
      });
    }

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
