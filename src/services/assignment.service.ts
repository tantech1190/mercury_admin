import api from './api';

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  auditorId: string;
  auditorName: string;
  deadline: Date | string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface UpdateAssignmentDTO {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  auditorId?: string;
  deadline?: Date | string;
}

class AssignmentService {
  async getAllAssignments() {
    try {
      const response = await api.get('/assignments');
      return response.data.assignments || response.data || [];
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }

  async getAssignmentById(id: string) {
    try {
      const response = await api.get(`/assignments/${id}`);
      return response.data.assignment || response.data;
    } catch (error: any) {
      console.error('Error fetching assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch assignment');
    }
  }

  async createAssignment(assignmentData: CreateAssignmentDTO) {
    try {
      const response = await api.post('/assignments', assignmentData);
      return response.data.assignment || response.data;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create assignment');
    }
  }

  async updateAssignment(id: string, updates: UpdateAssignmentDTO) {
    try {
      const response = await api.put(`/assignments/${id}`, updates);
      return response.data.assignment || response.data;
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update assignment');
    }
  }

  async deleteAssignment(id: string) {
    try {
      const response = await api.delete(`/assignments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete assignment');
    }
  }

  async getAssignmentsByAuditor(auditorId: string) {
    try {
      const response = await api.get(`/assignments/auditor/${auditorId}`);
      return response.data.assignments || response.data || [];
    } catch (error: any) {
      console.error('Error fetching auditor assignments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch auditor assignments');
    }
  }
}

export default new AssignmentService();
