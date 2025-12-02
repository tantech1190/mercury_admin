/**
 * AUDITOR SERVICE
 * ===============
 * Handles all auditor-related API calls
 */

import apiClient, { handleApiError } from './api';

export interface Auditor {
  _id: string;
  id?: string; // Backend also returns 'id'
  name: string;
  email: string;
  phone?: string;
  circles: string[];
  isActive?: boolean; // Backend uses isActive
  status?: 'active' | 'inactive'; // Some components may use status
  totalAuditsAssigned?: number; // Flat structure from backend
  totalAuditsCompleted?: number; // Flat structure from backend
  averageScore?: number; // Flat structure from backend
  completionRate?: number; // Flat structure from backend
  performanceMetrics?: { // Optional for backwards compatibility
    totalAuditsAssigned: number;
    totalAuditsCompleted: number;
    averageScore: number;
    completionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuditorData {
  name: string;
  email: string;
  phone?: string;
  circles: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateAuditorData {
  name?: string;
  email?: string;
  phone?: string;
  circles?: string[];
  status?: 'active' | 'inactive';
}

export interface AuditorStats {
  totalAuditors: number;
  activeAuditors: number;
  inactiveAuditors: number;
  totalAuditsAssigned: number;
  totalAuditsCompleted: number;
  averageCompletionRate: number;
  topPerformers: Auditor[];
}

class AuditorService {
  /**
   * Get all auditors
   */
  async getAllAuditors(): Promise<Auditor[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Auditor[] }>('/auditors');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get single auditor
   */
  async getAuditor(id: string): Promise<Auditor> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Auditor }>(`/auditors/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create new auditor
   */
  async createAuditor(data: CreateAuditorData): Promise<Auditor> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Auditor }>('/auditors', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update auditor
   */
  async updateAuditor(id: string, data: UpdateAuditorData): Promise<Auditor> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Auditor }>(`/auditors/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete auditor
   */
  async deleteAuditor(id: string): Promise<void> {
    try {
      await apiClient.delete(`/auditors/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get auditor statistics
   */
  async getAuditorStats(): Promise<AuditorStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: AuditorStats }>('/auditors/stats');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update auditor metrics (recalculate performance)
   */
  async updateAuditorMetrics(id: string): Promise<Auditor> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Auditor }>(`/auditors/${id}/update-metrics`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AuditorService();
