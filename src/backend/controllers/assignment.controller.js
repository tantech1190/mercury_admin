const Assignment = require('../models/Assignment.model');
const Auditor = require('../models/Auditor.model');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .populate('auditorId', 'name email phone');

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('auditorId', 'name email phone');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      assignment: assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment',
      error: error.message
    });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, auditorId, auditorName, deadline, status } = req.body;

    // Validate required fields
    if (!title || !description || !auditorId || !auditorName || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, auditorId, auditorName, deadline'
      });
    }

    // Check if auditor exists
    const auditor = await Auditor.findById(auditorId);
    if (!auditor) {
      return res.status(404).json({
        success: false,
        message: 'Auditor not found'
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      auditorId,
      auditorName,
      deadline: new Date(deadline),
      status: status || 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, status, auditorId, deadline } = req.body;

    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // If auditorId is being updated, verify the new auditor exists
    if (auditorId && auditorId !== assignment.auditorId.toString()) {
      const auditor = await Auditor.findById(auditorId);
      if (!auditor) {
        return res.status(404).json({
          success: false,
          message: 'Auditor not found'
        });
      }
    }

    // Update fields
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (status) assignment.status = status;
    if (auditorId) assignment.auditorId = auditorId;
    if (deadline) assignment.deadline = new Date(deadline);

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: assignment
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
      error: error.message
    });
  }
};

// @desc    Get assignments by auditor
// @route   GET /api/assignments/auditor/:auditorId
// @access  Private
exports.getAssignmentsByAuditor = async (req, res) => {
  try {
    const assignments = await Assignment.find({ auditorId: req.params.auditorId })
      .sort({ createdAt: -1 })
      .populate('auditorId', 'name email phone');

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments: assignments
    });
  } catch (error) {
    console.error('Error fetching auditor assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auditor assignments',
      error: error.message
    });
  }
};
