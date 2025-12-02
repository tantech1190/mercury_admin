/**
 * SHARED TYPE DEFINITIONS
 * ========================
 * Central location for all shared types used across the application
 */

// Re-export types from services
export type { Auditor, CreateAuditorData, UpdateAuditorData, AuditorStats } from '../services/auditor.service';
export type { Audit, CreateAuditData, UpdateAuditData, AuditFilters, AuditStats, Analytics } from '../services/audit.service';

/**
 * Assignment Type
 * Used for assigning audits to auditors with deadlines
 */
export interface Assignment {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  auditorId: string;
  auditorName: string;
  deadline: Date | string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
}

/**
 * Create Assignment Data
 */
export interface CreateAssignmentData {
  title: string;
  description: string;
  auditorId: string;
  auditorName: string;
  deadline: Date | string;
  status?: 'pending' | 'in-progress' | 'completed';
}
