/**
 * AUDITOR MODEL
 * Auditor information and management
 */

const mongoose = require('mongoose');

const auditorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide auditor name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide auditor email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  circles: [{
    type: String,
    enum: ['AP', 'BH', 'DEL', 'Guj', 'HR', 'JK', 'KER', 'KK', 'MPCG', 'Mum', 'NESA', 'OR', 'PB', 'RAJ', 'ROM', 'TN', 'UPE', 'UPW', 'WB'],
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  joiningDate: {
    type: Date
  },
  // Performance metrics (auto-calculated)
  totalAuditsAssigned: {
    type: Number,
    default: 0
  },
  totalAuditsCompleted: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Score breakdown by audit type
  scoreBreakdown: {
    store: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 }
    },
    ilms: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 }
    },
    xfe: {
      count: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 }
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
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
auditorSchema.index({ email: 1 });
auditorSchema.index({ circles: 1 });
auditorSchema.index({ isActive: 1 });
auditorSchema.index({ averageScore: -1 });

// Virtual for completion rate
auditorSchema.virtual('completionRate').get(function() {
  if (this.totalAuditsAssigned === 0) return 0;
  return Math.round((this.totalAuditsCompleted / this.totalAuditsAssigned) * 100);
});

// Method to update performance metrics
auditorSchema.methods.updatePerformanceMetrics = async function() {
  const Audit = mongoose.model('Audit');
  
  // Get all audits for this auditor
  const audits = await Audit.find({ auditorId: this._id });
  
  // Calculate totals
  this.totalAuditsAssigned = audits.length;
  this.totalAuditsCompleted = audits.filter(a => a.status === 'completed').length;
  
  // Calculate average score
  const auditsWithScores = audits.filter(a => a.score !== null && a.score !== undefined);
  if (auditsWithScores.length > 0) {
    const totalScore = auditsWithScores.reduce((sum, a) => sum + a.score, 0);
    this.averageScore = Math.round(totalScore / auditsWithScores.length);
  } else {
    this.averageScore = 0;
  }
  
  // Calculate breakdown by type
  const types = ['store', 'ilms', 'xfe'];
  types.forEach(type => {
    const typeAudits = auditsWithScores.filter(a => a.auditType === type);
    if (typeAudits.length > 0) {
      const typeScore = typeAudits.reduce((sum, a) => sum + a.score, 0);
      this.scoreBreakdown[type] = {
        count: typeAudits.length,
        avgScore: Math.round(typeScore / typeAudits.length)
      };
    } else {
      this.scoreBreakdown[type] = {
        count: 0,
        avgScore: 0
      };
    }
  });
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Auditor', auditorSchema);
