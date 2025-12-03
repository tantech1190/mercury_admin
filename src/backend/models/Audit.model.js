/**
 * AUDIT MODEL
 * Audit records with comprehensive field support
 */

const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  // Basic Information
  storeCode: {
    type: String,
    required: false, // REMOVED VALIDATION - Allow all data
    default: 'UNKNOWN',
    trim: true,
    index: true
  },
  storeName: {
    type: String,
    required: false, // REMOVED VALIDATION - Allow all data
    default: 'Unknown Store',
    trim: true
  },
  location: {
    type: String,
    required: false, // REMOVED VALIDATION - Allow all data  
    default: 'Unknown',
    trim: true
  },
  circle: {
    type: String,
    required: false, // REMOVED VALIDATION - Allow all data
    default: 'DEL',
    enum: ['AP', 'BH', 'DEL', 'Guj', 'HR', 'JK', 'KER', 'KK', 'MPCG', 'Mum', 'NESA', 'OR', 'PB', 'RAJ', 'ROM', 'TN', 'UPE', 'UPW', 'WB']
  },
  
  // Audit Type
  auditType: {
    type: String,
    required: false, // REMOVED VALIDATION - Allow all data
    default: 'store',
    enum: ['store', 'ilms', 'xfe'],
    lowercase: true
  },
  
  // Auditor Assignment
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auditor',
    index: true
  },
  auditorName: {
    type: String,
    trim: true
  },
  auditorEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  
  // Status and Timeline
  status: {
    type: String,
    enum: ['unassigned', 'open', 'in-progress', 'at-risk', 'completed'],
    default: 'unassigned',
    index: true
  },
  deadline: {
    type: Date,
    required: false, // REMOVED VALIDATION - Allow all data
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    index: true
  },
  completedAt: {
    type: Date
  },
  
  // Score
  score: {
    type: Number,
    min: 0,
    // REMOVED max: 100 validation - Allow any score value from Excel
    // Score will be capped in frontend parser
    index: true
  },
  
  // Score Breakdown (from calculator)
  scoreBreakdown: {
    totalScore: Number,
    categories: [{
      name: String,
      score: Number,
      weight: Number,
      weightedScore: Number
    }],
    details: {
      totalQuestions: Number,
      answeredQuestions: Number,
      positiveAnswers: Number,
      negativeAnswers: Number
    }
  },
  
  // Additional Fields for Store Audits
  storeAddress: String,
  city: String,
  pincode: String,
  
  // Additional Fields for ILMS Audits
  webInquiryDate: Date,
  webInquiryTime: String,
  advisorName: String,
  advisorContact: String,
  ambassadorName: String,
  visitDate: Date,
  visitTime: String,
  
  // Additional Fields for XFE Audits
  xfeName: String,
  xfeNumber: String,
  callDate: Date,
  callTime: String,
  
  // Month and Year for reporting
  month: String,
  year: String,
  
  // Raw Data (all responses from Excel)
  rawData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // File Upload Info
  uploadedFile: {
    filename: String,
    originalName: String,
    uploadDate: Date,
    fileSize: Number
  },
  
  // Metadata
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [String],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
auditSchema.index({ auditType: 1, status: 1 });
auditSchema.index({ circle: 1, status: 1 });
auditSchema.index({ auditorId: 1, status: 1 });
auditSchema.index({ deadline: 1, status: 1 });
auditSchema.index({ score: -1 });
auditSchema.index({ createdAt: -1 });

// Compound indexes
auditSchema.index({ auditType: 1, circle: 1 });
auditSchema.index({ auditorId: 1, auditType: 1 });

// Virtual for days until deadline
auditSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.deadline) return null;
  const today = new Date();
  const diffTime = this.deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for performance rating
auditSchema.virtual('performanceRating').get(function() {
  if (!this.score && this.score !== 0) return null;
  if (this.score >= 90) return 'Outstanding';
  if (this.score >= 80) return 'Excellent';
  if (this.score >= 70) return 'Very Good';
  if (this.score >= 60) return 'Good';
  if (this.score >= 50) return 'Average';
  return 'Needs Improvement';
});

// Pre-save middleware to update status based on deadline
auditSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    // Auto-set status to at-risk if deadline is within 2 days
    if (this.deadline) {
      const today = new Date();
      const diffTime = this.deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0 && this.status !== 'completed') {
        // Overdue
        this.status = 'at-risk';
      } else if (diffDays <= 2 && diffDays >= 0 && this.status === 'open') {
        // Within 2 days
        this.status = 'at-risk';
      }
    }
  }
  next();
});

// Method to calculate and update score
auditSchema.methods.calculateScore = async function() {
  const { calculateAuditScore, getScoreBreakdown } = require('../utils/scoreCalculator');
  
  if (this.rawData && Object.keys(this.rawData).length > 0) {
    // Calculate score
    const calculatedScore = calculateAuditScore(this.auditType, this.rawData);
    this.score = calculatedScore;
    
    // Get detailed breakdown
    const breakdown = getScoreBreakdown(this.auditType, this.rawData);
    this.scoreBreakdown = breakdown;
  }
  
  return this;
};

// Static method to get audits by filter
auditSchema.statics.getAuditsByFilter = function(filter = {}) {
  return this.find(filter)
    .populate('auditorId', 'name email circles')
    .sort({ createdAt: -1 });
};

// Static method to get analytics
auditSchema.statics.getAnalytics = async function() {
  const analytics = await this.aggregate([
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
        averageScores: [
          { $match: { score: { $ne: null } } },
          { $group: {
            _id: '$auditType',
            avgScore: { $avg: '$score' },
            count: { $sum: 1 }
          }}
        ],
        overallStats: [
          { $group: {
            _id: null,
            totalAudits: { $sum: 1 },
            completedAudits: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            avgScore: { $avg: '$score' }
          }}
        ]
      }
    }
  ]);
  
  
  return analytics[0];
};

module.exports = mongoose.model('Audit', auditSchema);