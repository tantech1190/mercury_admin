import { useState } from 'react';
import { X, MapPin, Calendar, Building2, Award, FileText, ChevronDown, ChevronUp, Eye, CheckCircle, Clock, AlertCircle, XCircle, Filter, Store, User } from 'lucide-react';
import { Audit } from '../services/audit.service';

interface AuditorAuditsModalProps {
  auditorName: string;
  audits: Audit[];
  onClose: () => void;
  onViewAuditDetails?: (audit: Audit) => void;
}

export function AuditorAuditsModal({ auditorName, audits, onClose, onViewAuditDetails }: AuditorAuditsModalProps) {
  const [filterType, setFilterType] = useState<'all' | 'store' | 'xfe' | 'ilms'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  // Filter audits
  const filteredAudits = audits.filter(audit => {
    if (filterType !== 'all' && audit.auditType !== filterType) return false;
    if (filterStatus !== 'all' && audit.status !== filterStatus) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    total: audits.length,
    completed: audits.filter(a => a.status === 'completed').length,
    inProgress: audits.filter(a => a.status === 'in-progress').length,
    pending: audits.filter(a => a.status === 'open' || a.status === 'unassigned').length,
    averageScore: audits.filter(a => a.score).length > 0 
      ? audits.filter(a => a.score).reduce((sum, a) => sum + (a.score || 0), 0) / audits.filter(a => a.score).length 
      : 0,
    byType: {
      store: audits.filter(a => a.auditType === 'store').length,
      xfe: audits.filter(a => a.auditType === 'xfe').length,
      ilms: audits.filter(a => a.auditType === 'ilms').length,
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      unassigned: '#6B7280',
      open: '#0AAE9A',
      'in-progress': '#2563EB',
      'at-risk': '#FBBF24',
      completed: '#22C55E',
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  };

  const getStatusBgColor = (status: string) => {
    const colors = {
      unassigned: 'rgba(107, 114, 128, 0.1)',
      open: 'rgba(10, 174, 154, 0.1)',
      'in-progress': 'rgba(37, 99, 235, 0.1)',
      'at-risk': 'rgba(251, 191, 36, 0.1)',
      completed: 'rgba(34, 197, 94, 0.1)',
    };
    return colors[status as keyof typeof colors] || 'rgba(107, 114, 128, 0.1)';
  };

  const getAuditTypeColor = (type: string) => {
    const colors = {
      store: '#2563EB',
      xfe: '#F97316',
      ilms: '#22C55E',
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getAuditTypeBg = (type: string) => {
    const colors = {
      store: 'rgba(37, 99, 235, 0.1)',
      xfe: 'rgba(249, 115, 22, 0.1)',
      ilms: 'rgba(34, 197, 94, 0.1)',
    };
    return colors[type as keyof typeof colors] || 'rgba(107, 114, 128, 0.1)';
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22C55E'; // Green
    if (score >= 75) return '#FBBF24'; // Yellow
    if (score >= 60) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        style={{ animation: 'slideUp 0.4s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-6 border-b-2 relative overflow-hidden flex-shrink-0"
          style={{ 
            background: 'linear-gradient(135deg, #0AAE9A, #078672)',
            borderColor: '#078672'
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <User className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{ color: 'white' }} />
                <h2 className="m-0 truncate" style={{ color: 'white', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '700' }}>
                  {auditorName}
                </h2>
              </div>
              <p className="m-0 text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Audits: {audits.length} • Completed: {stats.completed} • Avg: {stats.averageScore.toFixed(1)}%
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0"
              style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Audits */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(10, 174, 154, 0.1)' }}>
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#0AAE9A' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs m-0 truncate" style={{ color: '#6B7280' }}>Total</p>
                  <p className="m-0" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '700', color: '#0AAE9A' }}>
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#22C55E' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs m-0 truncate" style={{ color: '#6B7280' }}>Done</p>
                  <p className="m-0" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '700', color: '#22C55E' }}>
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#2563EB' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs m-0 truncate" style={{ color: '#6B7280' }}>Active</p>
                  <p className="m-0" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '700', color: '#2563EB' }}>
                    {stats.inProgress}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#FBBF24' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs m-0 truncate" style={{ color: '#6B7280' }}>Score</p>
                  <p className="m-0 truncate" style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: '700', color: getScoreColor(stats.averageScore) }}>
                    {stats.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Type Breakdown */}
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2" style={{ borderColor: '#2563EB', background: 'rgba(37, 99, 235, 0.05)' }}>
              <Store className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
              <span style={{ color: '#2563EB', fontWeight: '600', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>
                STORE: {stats.byType.store}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2" style={{ borderColor: '#F97316', background: 'rgba(249, 115, 22, 0.05)' }}>
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#F97316' }} />
              <span style={{ color: '#F97316', fontWeight: '600', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>
                XFE: {stats.byType.xfe}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2" style={{ borderColor: '#22C55E', background: 'rgba(34, 197, 94, 0.05)' }}>
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
              <span style={{ color: '#22C55E', fontWeight: '600', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>
                ILMS: {stats.byType.ilms}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#0AAE9A' }} />
            <h3 className="m-0" style={{ color: '#111827', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '700' }}>
              Filter Audits
            </h3>
          </div>
          
          <div className="space-y-3">
            {/* Type Filter */}
            <div>
              <p className="text-xs sm:text-sm mb-2 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>By Type:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterType === 'all' ? 'linear-gradient(135deg, #0AAE9A, #078672)' : 'white',
                    color: filterType === 'all' ? 'white' : '#6B7280',
                    border: filterType === 'all' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  All ({audits.length})
                </button>
                <button
                  onClick={() => setFilterType('store')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterType === 'store' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'white',
                    color: filterType === 'store' ? 'white' : '#6B7280',
                    border: filterType === 'store' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  Store ({stats.byType.store})
                </button>
                <button
                  onClick={() => setFilterType('xfe')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterType === 'xfe' ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'white',
                    color: filterType === 'xfe' ? 'white' : '#6B7280',
                    border: filterType === 'xfe' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  XFE ({stats.byType.xfe})
                </button>
                <button
                  onClick={() => setFilterType('ilms')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterType === 'ilms' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'white',
                    color: filterType === 'ilms' ? 'white' : '#6B7280',
                    border: filterType === 'ilms' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  ILMS ({stats.byType.ilms})
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-xs sm:text-sm mb-2 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>By Status:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterStatus === 'all' ? '#6B7280' : 'white',
                    color: filterStatus === 'all' ? 'white' : '#6B7280',
                    border: filterStatus === 'all' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterStatus === 'completed' ? '#22C55E' : 'white',
                    color: filterStatus === 'completed' ? 'white' : '#6B7280',
                    border: filterStatus === 'completed' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilterStatus('in-progress')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                  style={{
                    background: filterStatus === 'in-progress' ? '#2563EB' : 'white',
                    color: filterStatus === 'in-progress' ? 'white' : '#6B7280',
                    border: filterStatus === 'in-progress' ? 'none' : '2px solid #E5E7EB',
                    fontWeight: '600'
                  }}
                >
                  In Progress
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audits List - Scrollable */}
        <div className="overflow-y-auto flex-1" style={{ minHeight: '200px' }}>
          {filteredAudits.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <XCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
              <p className="m-0 text-sm sm:text-base" style={{ color: '#6B7280' }}>
                No audits found with the selected filters
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {filteredAudits.map((audit) => (
                <div
                  key={audit._id}
                  className="bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ borderColor: expandedAuditId === audit._id ? '#0AAE9A' : '#E5E7EB' }}
                >
                  {/* Audit Card Header */}
                  <div 
                    className="p-3 sm:p-4 cursor-pointer"
                    onClick={() => setExpandedAuditId(expandedAuditId === audit._id ? null : audit._id)}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span 
                            className="px-2 sm:px-3 py-1 rounded-lg text-xs uppercase flex-shrink-0"
                            style={{
                              background: getAuditTypeBg(audit.auditType),
                              color: getAuditTypeColor(audit.auditType),
                              fontWeight: '700'
                            }}
                          >
                            {audit.auditType}
                          </span>
                          <span 
                            className="px-2 sm:px-3 py-1 rounded-lg text-xs uppercase flex-shrink-0"
                            style={{
                              background: getStatusBgColor(audit.status),
                              color: getStatusColor(audit.status),
                              fontWeight: '700'
                            }}
                          >
                            {audit.status}
                          </span>
                          {audit.score && (
                            <span 
                              className="px-2 sm:px-3 py-1 rounded-lg text-xs flex-shrink-0"
                              style={{
                                background: `${getScoreColor(audit.score)}15`,
                                color: getScoreColor(audit.score),
                                fontWeight: '700'
                              }}
                            >
                              {audit.score}%
                            </span>
                          )}
                        </div>
                        
                        {/* Store Name */}
                        <h4 className="m-0 mb-2 truncate" style={{ color: '#111827', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '700' }}>
                          {audit.storeName}
                        </h4>
                        
                        {/* Details */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                            <span className="truncate" style={{ color: '#6B7280' }}>{audit.storeCode}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                            <span className="truncate" style={{ color: '#6B7280' }}>{audit.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                            <span className="truncate" style={{ color: '#6B7280' }}>{formatDate(audit.deadline)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {onViewAuditDetails && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewAuditDetails(audit);
                            }}
                            className="p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-110"
                            style={{ background: 'rgba(10, 174, 154, 0.1)', color: '#0AAE9A' }}
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        <button className="p-1.5 sm:p-2" onClick={(e) => e.stopPropagation()}>
                          {expandedAuditId === audit._id ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#0AAE9A' }} />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#6B7280' }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAuditId === audit._id && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs mb-1 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>Circle</p>
                          <p className="m-0 text-sm sm:text-base break-words" style={{ color: '#111827' }}>{audit.circle || 'N/A'}</p>
                        </div>
                        
                        {audit.auditorEmail && (
                          <div>
                            <p className="text-xs mb-1 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>Email</p>
                            <p className="m-0 text-sm sm:text-base break-all" style={{ color: '#111827' }}>{audit.auditorEmail}</p>
                          </div>
                        )}
                        
                        {audit.createdAt && (
                          <div>
                            <p className="text-xs mb-1 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>Created At</p>
                            <p className="m-0 text-sm sm:text-base" style={{ color: '#111827' }}>{formatDate(audit.createdAt)}</p>
                          </div>
                        )}
                        
                        {audit.completedAt && (
                          <div>
                            <p className="text-xs mb-1 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>Completed At</p>
                            <p className="m-0 text-sm sm:text-base" style={{ color: '#111827' }}>{formatDate(audit.completedAt)}</p>
                          </div>
                        )}
                      </div>

                      {/* Type-specific fields */}
                      {audit.auditType === 'store' && audit.storeAuditDate && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                          <p className="text-xs mb-1 m-0" style={{ color: '#6B7280', fontWeight: '600' }}>Store Audit Date</p>
                          <p className="m-0 text-sm sm:text-base" style={{ color: '#111827' }}>
                            {formatDate(audit.storeAuditDate)}
                            {audit.storeAuditTime && ` at ${audit.storeAuditTime}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="m-0 text-xs sm:text-sm text-center sm:text-left" style={{ color: '#6B7280' }}>
              Showing {filteredAudits.length} of {audits.length} audits
            </p>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              style={{
                background: 'linear-gradient(135deg, #0AAE9A, #078672)',
                color: 'white',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
