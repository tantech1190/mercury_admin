/**
 * SERVICES INDEX
 * ==============
 * Central export for all services
 */

export { default as authService } from './auth.service';
export { default as auditorService } from './auditor.service';
export { default as auditService } from './audit.service';
export { default as uploadService } from './upload.service';
export { default as reportService } from './report.service';
export { default as apiClient, handleApiError, getErrorDetails } from './api';

// Export types
export type { LoginCredentials, RegisterData, User, AuthResponse } from './auth.service';
export type { Auditor, CreateAuditorData, UpdateAuditorData, AuditorStats } from './auditor.service';
export type { Audit, CreateAuditData, UpdateAuditData, AuditFilters, AuditStats, Analytics } from './audit.service';
export type { UploadResult } from './upload.service';
export type { 
  OverviewStats, 
  AuditorPerformanceReport, 
  CirclePerformanceReport, 
  ScoreAnalytics,
  AuditTypeBreakdown,
  TrendingData,
  ExportOptions 
} from './report.service';
