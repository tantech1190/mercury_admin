/**
 * AUDIT SERVICE
 * =============
 * Handles all audit-related API calls
 */

import apiClient, { handleApiError } from './api';

export interface Audit {
  _id: string;
  storeCode: string;
  storeName: string;
  location: string;
  auditType: 'store' | 'ilms' | 'xfe';
  circle: string;
  deadline: Date;
  status: 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed';
  score?: number;
  auditorId?: string;
  auditorName?: string;
  auditorEmail?: string;
  rawData?: Record<string, any>;
  
  // Type-specific fields
  pincode?: string;
  month?: string;
  year?: string;
  
  // ILMS specific
  webInquiryDate?: Date;
  webInquiryTime?: string;
  advisorName?: string;
  advisorContact?: string;
  ambassadorName?: string;
  visitDate?: Date;
  visitTime?: string;
  
  // XFE specific
  callDate?: Date;
  callTime?: string;
  xfeName?: string;
  xfeNumber?: string;
  
  // Store specific
  storeId?: string;
  storeAddress?: string;
  croExecutiveName?: string;
  storeAuditDate?: Date;
  storeAuditTime?: string;
  
  // Common optional fields
  timestamp?: Date;
  emailAddress?: string;
  scenario?: string;
  tsm?: string;
  zsm?: string;
  zbm?: string;
  completedAt?: Date;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateAuditData {
  storeCode: string;
  storeName: string;
  location: string;
  auditType: 'store' | 'ilms' | 'xfe';
  circle: string;
  deadline: Date | string;
  status?: 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed';
  score?: number;
  auditorId?: string;
  auditorName?: string;
  rawData?: Record<string, any>;
  pincode?: string;
  month?: string;
  year?: string;
  
  // ILMS specific
  webInquiryDate?: Date | string;
  webInquiryTime?: string;
  advisorName?: string;
  advisorContact?: string;
  ambassadorName?: string;
  visitDate?: Date | string;
  visitTime?: string;
  
  // XFE specific
  callDate?: Date | string;
  callTime?: string;
  xfeName?: string;
  xfeNumber?: string;
  
  // Common optional fields
  timestamp?: Date | string;
  emailAddress?: string;
  scenario?: string;
  tsm?: string;
  zsm?: string;
  zbm?: string;
  
  // Store specific
  storeId?: string;
  storeAddress?: string;
  croExecutiveName?: string;
  storeAuditDate?: Date | string;
  storeAuditTime?: string;
}

export interface UpdateAuditData {
  storeCode?: string;
  storeName?: string;
  location?: string;
  circle?: string;
  deadline?: Date | string;
  status?: 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed';
  score?: number;
  rawData?: Record<string, any>;
}

export interface AuditFilters {
  auditType?: 'store' | 'ilms' | 'xfe';
  circle?: string;
  status?: string;
  auditorId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditStats {
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  openAudits: number;
  unassignedAudits: number;
  atRiskAudits: number;
  overdueAudits: number;
  averageScore: number;
  completionRate: number;
  byType: {
    store: number;
    ilms: number;
    xfe: number;
  };
  byCircle: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface Analytics {
  overview: AuditStats;
  circlePerformance: Array<{
    circle: string;
    totalAudits: number;
    completedAudits: number;
    averageScore: number;
    completionRate: number;
  }>;
  auditorPerformance: Array<{
    auditorId: string;
    auditorName: string;
    totalAudits: number;
    completedAudits: number;
    averageScore: number;
    completionRate: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  trendData: Array<{
    date: string;
    completed: number;
    averageScore: number;
  }>;
}

class AuditService {
  /**
   * Get all audits with optional filtering
   */
  async getAllAudits(filters?: AuditFilters): Promise<{ audits: Audit[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      
      const response = await apiClient.get<{ 
        success: boolean; 
        data: Audit[]; 
        pagination: any 
      }>(`/audits?${params.toString()}`);
      
      return {
        audits: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get single audit
   */
  async getAudit(id: string): Promise<Audit> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Audit }>(`/audits/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create new audit
   */
  async createAudit(data: CreateAuditData): Promise<Audit> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Audit }>('/audits', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Bulk create audits from Excel upload
   */
  async bulkCreateAudits(audits: CreateAuditData[]): Promise<{
    success: number;
    failed: number;
    audits: Audit[];
    errors: Array<{ index: number; error: string }>;
  }> {
    try {
      const response = await apiClient.post<{ 
        success: boolean; 
        data: {
          success: number;
          failed: number;
          audits: Audit[];
          errors: Array<{ index: number; error: string }>;
        }
      }>('/audits/bulk', { audits });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update audit
   */
  async updateAudit(id: string, data: UpdateAuditData): Promise<Audit> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Audit }>(`/audits/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete audit
   */
  async deleteAudit(id: string): Promise<void> {
    try {
      await apiClient.delete(`/audits/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Bulk delete audits
   */
  async bulkDeleteAudits(ids: string[]): Promise<void> {
    try {
      await apiClient.delete('/audits', { data: { ids } });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Assign audit to auditor
   */
  async assignAudit(auditId: string, auditorId: string): Promise<Audit> {
    try {
      const response = await apiClient.patch<{ success: boolean; data: Audit }>(
        `/audits/${auditId}/assign`,
        { auditorId }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update audit status
   */
  async updateStatus(auditId: string, status: string): Promise<Audit> {
    try {
      const response = await apiClient.patch<{ success: boolean; data: Audit }>(
        `/audits/${auditId}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Calculate audit score
   */
  async calculateScore(auditId: string): Promise<Audit> {
    try {
      const response = await apiClient.patch<{ success: boolean; data: Audit }>(
        `/audits/${auditId}/calculate-score`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(): Promise<AuditStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: AuditStats }>('/audits/stats');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get comprehensive analytics
   */
  async getAnalytics(): Promise<Analytics> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Analytics }>('/audits/analytics');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AuditService();
