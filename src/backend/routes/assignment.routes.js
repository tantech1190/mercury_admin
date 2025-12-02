const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByAuditor
} = require('../controllers/assignment.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
  .get(getAllAssignments)
  .post(createAssignment);

router.route('/:id')
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

router.route('/auditor/:auditorId')
  .get(getAssignmentsByAuditor);

module.exports = router;
