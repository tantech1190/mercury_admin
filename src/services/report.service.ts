/**
 * REPORT SERVICE
 * ==============
 * Handles analytics and reporting API calls
 */

import apiClient, { handleApiError } from './api';

export interface OverviewStats {
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  openAudits: number;
  unassignedAudits: number;
  atRiskAudits: number;
  overdueAudits: number;
  upcomingDeadlines: number;
  averageScore: number;
  completionRate: number;
  totalAuditors: number;
  activeAuditors: number;
}

export interface AuditorPerformanceReport {
  auditorId: string;
  auditorName: string;
  email: string;
  circles: string[];
  totalAuditsAssigned: number;
  totalAuditsCompleted: number;
  auditsInProgress: number;
  completionRate: number;
  averageScore: number;
  scoresByType: {
    store?: number;
    ilms?: number;
    xfe?: number;
  };
  auditCounts: {
    store: number;
    ilms: number;
    xfe: number;
  };
  minScore: number;
  maxScore: number;
  scoreRange: number;
  rank: number;
}

export interface CirclePerformanceReport {
  circle: string;
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  completionRate: number;
  averageScore: number;
  auditsByType: {
    store: number;
    ilms: number;
    xfe: number;
  };
  topAuditor: string;
  rank: number;
}

export interface ScoreAnalytics {
  overall: {
    averageScore: number;
    medianScore: number;
    minScore: number;
    maxScore: number;
    totalScoredAudits: number;
  };
  byType: Array<{
    type: 'store' | 'ilms' | 'xfe';
    averageScore: number;
    count: number;
    minScore: number;
    maxScore: number;
  }>;
  byCircle: Array<{
    circle: string;
    averageScore: number;
    count: number;
  }>;
  distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  trending: Array<{
    period: string;
    averageScore: number;
    count: number;
  }>;
}

export interface AuditTypeBreakdown {
  type: 'store' | 'ilms' | 'xfe';
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  openAudits: number;
  completionRate: number;
  averageScore: number;
  topCircle: string;
  topAuditor: string;
}

export interface TrendingData {
  daily: Array<{
    date: string;
    completed: number;
    averageScore: number;
    totalAudits: number;
  }>;
  weekly: Array<{
    week: string;
    completed: number;
    averageScore: number;
    totalAudits: number;
  }>;
  monthly: Array<{
    month: string;
    completed: number;
    averageScore: number;
    totalAudits: number;
  }>;
}

export interface ExportOptions {
  format?: 'csv' | 'excel';
  type?: 'audits' | 'auditors' | 'summary';
  filters?: Record<string, any>;
}

class ReportService {
  /**
   * Get overview statistics
   */
  async getOverview(): Promise<OverviewStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: OverviewStats }>('/reports/overview');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get auditor performance report
   */
  async getAuditorPerformance(): Promise<AuditorPerformanceReport[]> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: AuditorPerformanceReport[] 
      }>('/reports/auditor-performance');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get circle performance report
   */
  async getCirclePerformance(): Promise<CirclePerformanceReport[]> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: CirclePerformanceReport[] 
      }>('/reports/circle-performance');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get score analytics
   */
  async getScoreAnalytics(): Promise<ScoreAnalytics> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: ScoreAnalytics 
      }>('/reports/score-analytics');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get audit type breakdown
   */
  async getAuditTypeBreakdown(): Promise<AuditTypeBreakdown[]> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: AuditTypeBreakdown[] 
      }>('/reports/audit-type-breakdown');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get trending data
   */
  async getTrendingData(): Promise<TrendingData> {
    try {
      const response = await apiClient.get<{ 
        success: boolean; 
        data: TrendingData 
      }>('/reports/trending');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export report
   */
  async exportReport(options: ExportOptions = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (options.format) params.append('format', options.format);
      if (options.type) params.append('type', options.type);
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          params.append(key, String(value));
        });
      }

      const response = await apiClient.get(`/reports/export?${params.toString()}`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Helper to trigger file download
   */
  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ReportService();
