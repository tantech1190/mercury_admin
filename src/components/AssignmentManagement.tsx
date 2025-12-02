import { useState } from 'react';
import { Plus, Calendar, User, ClipboardList } from 'lucide-react';
import { AssignmentForm } from './AssignmentForm';
import { Auditor, Assignment } from '../types';

interface AssignmentManagementProps {
  auditors?: Auditor[];
  assignments?: Assignment[];
  onAddAssignment?: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment?: (id: string, status: Assignment['status']) => void;
}

export function AssignmentManagement({
  auditors = [],
  assignments = [],
  onAddAssignment = () => {},
  onUpdateAssignment = () => {},
}: AssignmentManagementProps = {}) {
  const [showForm, setShowForm] = useState(false);

  // Ensure auditors and assignments are always arrays
  const safeAuditors = auditors || [];
  const safeAssignments = assignments || [];

  const handleSubmit = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    onAddAssignment(assignment);
    setShowForm(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div>
          <h2 className="mb-2 sm:mb-3 bg-gradient-to-r from-[#00a63e] via-[#00c447] to-[#008532] bg-clip-text text-transparent animate-gradient" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: '700', letterSpacing: '-0.03em' }}>Assignment Management</h2>
          <p className="m-0 text-base sm:text-lg" style={{ color: '#6b7280', fontWeight: '500' }}>Create and manage audit assignments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={safeAuditors.length === 0}
          className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(0,166,62,0.3)] hover:shadow-[0_15px_40px_rgba(0,166,62,0.4)] relative overflow-hidden group w-full sm:w-auto text-sm sm:text-base"
          style={{ 
            background: safeAuditors.length === 0 
              ? '#bbf7d0' 
              : 'linear-gradient(135deg, #00a63e 0%, #008532 50%, #00a63e 100%)',
            backgroundSize: '200% 100%',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            if (safeAuditors.length > 0) {
              e.currentTarget.style.backgroundPosition = '100% 0';
            }
          }}
          onMouseLeave={(e) => {
            if (safeAuditors.length > 0) {
              e.currentTarget.style.backgroundPosition = '0% 0';
            }
          }}
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          <span className="relative z-10">Create Assignment</span>
          {safeAuditors.length > 0 && (
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          )}
        </button>
      </div>

      {safeAuditors.length === 0 && (
        <div className="px-4 sm:px-7 py-4 sm:py-5 rounded-2xl mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-lg border-2" style={{ backgroundColor: 'rgba(254, 243, 199, 0.5)', borderColor: '#fde047', backdropFilter: 'blur(10px)' }}>
          <div className="p-2 sm:p-3 rounded-xl bg-yellow-100 flex-shrink-0 shadow-sm">
            <span className="text-xl sm:text-2xl">⚠️</span>
          </div>
          <div>
            <p className="m-0 mb-1 text-sm sm:text-base" style={{ color: '#92400e', fontWeight: '600' }}>
              No Auditors Available
            </p>
            <p className="m-0 text-xs sm:text-sm" style={{ color: '#854d0e', fontWeight: '500' }}>
              Please create at least one auditor before creating assignments.
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-10 animate-slideDown">
          <AssignmentForm
            auditors={safeAuditors}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Premium Assignments List */}
      <div className="space-y-5">
        {safeAssignments.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 sm:p-16 text-center border border-white/50">
            <div className="inline-flex p-4 sm:p-6 rounded-3xl mb-4 sm:mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #e6f7ed, #d1f4e0)' }}>
              <ClipboardList className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: '#00a63e' }} />
            </div>
            <h4 className="mb-2" style={{ color: '#00a63e', fontSize: '1.25rem', fontWeight: '600' }}>No Assignments Yet</h4>
            <p className="m-0" style={{ color: '#6b7280', fontWeight: '500' }}>Create your first assignment to get started!</p>
          </div>
        ) : (
          safeAssignments.map((assignment, index) => (
            <div 
              key={assignment._id || assignment.id} 
              className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-4 sm:p-7 border border-white/50 hover:border-[#00a63e] hover:shadow-[0_20px_60px_rgba(0,166,62,0.15)] transition-all duration-500 relative overflow-hidden group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 group-hover:w-1.5 sm:group-hover:w-2 transition-all duration-300 rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #00a63e, #008532)' }}></div>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#00a63e', filter: 'blur(40px)' }}></div>
              
              <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-5 relative z-10">
                <div className="flex-1 min-w-0 pl-2 sm:pl-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: '#00a63e', boxShadow: '0 0 10px rgba(0, 166, 62, 0.5)' }}></div>
                    <h3 className="m-0 truncate" style={{ color: '#00a63e', fontWeight: '700', fontSize: 'clamp(1rem, 4vw, 1.25rem)', letterSpacing: '-0.01em' }}>{assignment.title}</h3>
                  </div>
                  <p className="mb-4 sm:mb-5 pl-4 sm:pl-6 m-0 break-words" style={{ color: '#4b5563', fontWeight: '500', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>{assignment.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pl-4 sm:pl-6">
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#e6f7ed] shadow-sm transition-all hover:border-[#00a63e]" style={{ backgroundColor: 'rgba(249, 255, 254, 0.5)' }}>
                      <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#00a63e' }} />
                      <span className="text-xs sm:text-sm truncate" style={{ color: '#4b5563', fontWeight: '600' }}>{assignment.auditorName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#e6f7ed] shadow-sm transition-all hover:border-[#00a63e]" style={{ backgroundColor: 'rgba(249, 255, 254, 0.5)' }}>
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#00a63e' }} />
                      <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: '#4b5563', fontWeight: '600' }}>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 pl-2 sm:pl-4 w-full sm:w-auto">
                  <select
                    value={assignment.status}
                    onChange={(e) => onUpdateAssignment(assignment._id || assignment.id || '', e.target.value as Assignment['status'])}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 shadow-md text-sm sm:text-base"
                    style={{
                      backgroundColor: assignment.status === 'completed' ? '#e6f7ed' : assignment.status === 'in-progress' ? '#dbeafe' : '#fef3c7',
                      borderColor: assignment.status === 'completed' ? '#00a63e' : assignment.status === 'in-progress' ? '#2563eb' : '#f59e0b',
                      color: assignment.status === 'completed' ? '#008532' : assignment.status === 'in-progress' ? '#1e40af' : '#92400e',
                      fontWeight: '600',
                      fontSize: 'clamp(0.85rem, 3vw, 0.95rem)'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 sm:pt-5 flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 relative z-10" style={{ borderTop: '2px solid rgba(230, 247, 237, 0.3)' }}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#6b7280' }}></div>
                <p className="text-xs sm:text-sm m-0 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg truncate" style={{ color: '#6b7280', fontWeight: '500', backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Created: </span>{assignment.createdAt ? new Date(assignment.createdAt).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}