import { useState } from 'react';
import { X, Plus, User } from 'lucide-react';
import { Auditor, Assignment } from '../types';

interface AssignmentFormProps {
  auditors: Auditor[];
  onSubmit: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function AssignmentForm({ auditors, onSubmit, onCancel }: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    auditorId: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAuditor = auditors.find((a) => (a.id || a._id) === formData.auditorId);
    if (!selectedAuditor) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      auditorId: formData.auditorId,
      auditorName: selectedAuditor.name,
      deadline: new Date(formData.deadline),
      status: 'pending',
    });
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 lg:p-10 border border-white/50 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 gap-4" style={{ borderBottom: '2px solid rgba(230, 247, 237, 0.5)' }}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-2xl flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #e6f7ed, #d1f4e0)' }}>
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#00a63e' }} />
          </div>
          <div>
            <h3 className="m-0 mb-1" style={{ color: '#00a63e', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700', letterSpacing: '-0.02em' }}>Create New Assignment</h3>
            <p className="text-xs sm:text-sm m-0" style={{ color: '#6b7280', fontWeight: '500' }}>Assign an audit task to an auditor</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0 border-2 border-transparent hover:border-red-200 self-end sm:self-auto"
          style={{ backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 226, 226, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 226, 226, 0.5)'}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
        <div>
          <label htmlFor="title" className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
            Assignment Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50 text-sm sm:text-base"
            style={{ borderColor: '#e6f7ed', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#00a63e';
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e6f7ed';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
            placeholder="Enter assignment title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50 text-sm sm:text-base"
            style={{ borderColor: '#e6f7ed', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#00a63e';
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e6f7ed';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
            placeholder="Enter assignment description"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="auditor" className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
              Assign to Auditor *
            </label>
            <select
              id="auditor"
              value={formData.auditorId}
              onChange={(e) => setFormData({ ...formData, auditorId: e.target.value })}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50 text-sm sm:text-base"
              style={{ borderColor: '#e6f7ed', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00a63e';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e6f7ed';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
              required
            >
              <option value="">Select an auditor</option>
              {auditors.map((auditor) => (
                <option key={auditor._id || auditor.id} value={auditor._id || auditor.id}>
                  {auditor.name} - {auditor.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block mb-2 sm:mb-3" style={{ color: '#00a63e', fontWeight: '600', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}>
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50 text-sm sm:text-base"
              style={{ borderColor: '#e6f7ed', fontSize: 'clamp(0.875rem, 3vw, 0.95rem)' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#00a63e';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 166, 62, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e6f7ed';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {formData.auditorId && (
          <div className="rounded-2xl p-4 sm:p-5 md:p-7 border-2 w-full backdrop-blur-sm shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(230, 247, 237, 0.6), rgba(209, 244, 224, 0.6))', borderColor: '#00a63e' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <User className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#00a63e' }} />
              <p className="m-0" style={{ color: '#00a63e', fontWeight: '700', fontSize: 'clamp(0.95rem, 3vw, 1.05rem)' }}>Selected Auditor Details</p>
            </div>
            {auditors
              .filter((a) => (a.id || a._id) === formData.auditorId)
              .map((auditor) => (
                <div key={auditor.id || auditor._id} className="space-y-2 sm:space-y-3 pl-4 sm:pl-7 md:pl-9" style={{ color: '#4b5563' }}>
                  <p className="m-0 flex items-center gap-2 text-xs sm:text-sm break-words" style={{ fontWeight: '600' }}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00a63e] flex-shrink-0"></span>
                    <span className="break-all">Email: {auditor.email}</span>
                  </p>
                  {auditor.phone && (
                    <p className="m-0 flex items-center gap-2 text-xs sm:text-sm" style={{ fontWeight: '600' }}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00a63e] flex-shrink-0"></span>
                      Mobile: {auditor.phone}
                    </p>
                  )}
                  {auditor.circles && auditor.circles.length > 0 && (
                    <p className="m-0 flex items-center gap-2 text-xs sm:text-sm flex-wrap" style={{ fontWeight: '600' }}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00a63e] flex-shrink-0"></span>
                      <span>Circles: {auditor.circles.join(', ')}</span>
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <button
            type="submit"
            className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(0,166,62,0.3)] hover:shadow-[0_15px_40px_rgba(0,166,62,0.4)] relative overflow-hidden group text-sm sm:text-base"
            style={{ background: 'linear-gradient(135deg, #00a63e 0%, #008532 50%, #00a63e 100%)', backgroundSize: '200% 100%', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = '100% 0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = '0% 0'}
          >
            <span className="relative z-10">Create Assignment</span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-sm text-sm sm:text-base"
            style={{ borderColor: '#00a63e', color: '#008532', backgroundColor: 'white', fontWeight: '600' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6f7ed';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}