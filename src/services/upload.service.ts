/**
 * UPLOAD SERVICE
 * ==============
 * Handles file upload operations
 */

import apiClient, { handleApiError } from './api';
import { Audit } from './audit.service';

export interface UploadResult {
  success: boolean;
  message: string;
  data: {
    totalRows: number;
    successfulImports: number;
    failedImports: number;
    audits: Audit[];
    errors: Array<{
      row: number;
      message: string;
    }>;
  };
}

class UploadService {
  /**
   * Upload Excel file
   */
  async uploadExcel(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<UploadResult>('/upload/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Download Excel template
   */
  async downloadTemplate(type: 'store' | 'ilms' | 'xfe'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/upload/template/${type}`, {
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

export default new UploadService();
