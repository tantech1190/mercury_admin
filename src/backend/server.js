/**
 * MERCURY MYSTERY ADMIN - BACKEND SERVER (Railway Optimized)
 * ==========================================================
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: __dirname + '/.env' });

// Import routes
const authRoutes = require('./routes/auth.routes');
const auditorRoutes = require('./routes/auditor.routes');
const auditRoutes = require('./routes/audit.routes');
const reportRoutes = require('./routes/report.routes');
const uploadRoutes = require('./routes/upload.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const errorHandler = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

/* ============================================================
   RAILWAY-REQUIRED FAST HEALTH ROUTES (must be before middleware)
   ============================================================ */

// Instant response for Railway root health-check
app.get('/', (req, res) => res.send("OK"));

// Simple ping
app.get('/ping', (req, res) => res.send("pong"));

/* ============================================================
   MIDDLEWARE
   ============================================================ */

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mercury_admin.in",
      "https://mercury-admin-frontend.vercel.app",
      "https://mercuryadmin-production.up.railway.app"
    ],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Rate Limiter (Only for API routes)
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// Static uploaded files
app.use('/uploads', express.static('uploads'));

/* ============================================================
   DATABASE CONNECTION (called after server starts)
   ============================================================ */

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
}

/* ============================================================
   API ROUTES
   ============================================================ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mercury Mystery Admin API is running',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/auditors', auditorRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/assignments', assignmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

/* ============================================================
   SERVER STARTUP
   ============================================================ */

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Mercury Mystery Admin Backend Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Listening on 0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base API URL: https://mercuryadmin-production.up.railway.app/api`);
  console.log(`📊 Health Check: https://mercuryadmin-production.up.railway.app/api/health`);
  console.log('='.repeat(50) + '\n');

  // Connect DB AFTER server start
  connectDB();
});

/* ============================================================
   PROCESS HANDLERS
   ============================================================ */
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;
