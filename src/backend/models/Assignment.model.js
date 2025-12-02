const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true
  },
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auditor',
    required: [true, 'Auditor ID is required']
  },
  auditorName: {
    type: String,
    required: [true, 'Auditor name is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for faster queries
assignmentSchema.index({ auditorId: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ deadline: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
