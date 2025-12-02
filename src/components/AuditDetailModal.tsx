import { X, MapPin, Calendar, User, Phone, Mail, Star, FileText, CheckCircle } from 'lucide-react';
import { Audit } from '../services/audit.service';

interface AuditDetailModalProps {
  audit: Audit;
  onClose: () => void;
  onUpdateStatus?: (status: Audit['status']) => void;
}

export function AuditDetailModal({ audit, onClose, onUpdateStatus }: AuditDetailModalProps) {
  // Debug: Log audit data
  console.log('🔍 AuditDetailModal - Full audit data:', audit);
  console.log('🔍 XFE Fields:', {
    xfeName: audit.xfeName,
    xfeNumber: audit.xfeNumber,
    callDate: audit.callDate,
    callTime: audit.callTime
  });

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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0AAE9A] to-[#078672] p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="m-0 text-white" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {audit.auditType.toUpperCase()} Audit Details
            </h2>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl hover:bg-opacity-30 transition-all duration-300 hover:rotate-90"
              style={{ 
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-lg text-sm uppercase tracking-wide bg-white" style={{ 
              color: getStatusColor(audit.status),
              fontWeight: '700'
            }}>
              {audit.status}
            </span>
            <span className="px-4 py-2 rounded-lg text-sm uppercase tracking-wide bg-white text-[#0AAE9A]" style={{ fontWeight: '700' }}>
              {audit.auditType}
            </span>
            {audit.score && (
              <span className="px-4 py-2 rounded-lg text-sm bg-white text-[#0AAE9A] flex items-center gap-2" style={{ fontWeight: '700' }}>
                <Star className="w-4 h-4 fill-current" />
                Score: {audit.score}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Common Information */}
          <div className="bg-[#E0F7F4] rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
              <FileText className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>ID</label>
                <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.storeCode}</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>Name</label>
                <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.storeName}</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>Circle</label>
                <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.circle}</p>
              </div>
              {audit.auditorName && (
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>Auditor</label>
                  <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.auditorName}</p>
                </div>
              )}
              {audit.month && (
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>Month/Year</label>
                  <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.month} {audit.year}</p>
                </div>
              )}
              {audit.scenario && (
                <div>
                  <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#078672', fontWeight: '700' }}>Scenario</label>
                  <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.scenario}</p>
                </div>
              )}
            </div>
          </div>

          {/* Store Specific */}
          {audit.auditType === 'store' && (
            <>
              <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
                  <MapPin className="w-5 h-5" />
                  Store Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {audit.storeId && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Store ID</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.storeId}</p>
                    </div>
                  )}
                  {audit.storeAddress && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Address</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.storeAddress}</p>
                    </div>
                  )}
                  {audit.croExecutiveName && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>CRO/Executive</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.croExecutiveName}</p>
                    </div>
                  )}
                  {audit.storeAuditDate && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Audit Date</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                        {new Date(audit.storeAuditDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {audit.storeAuditTime && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Audit Time</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.storeAuditTime}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ILMS Specific */}
          {audit.auditType === 'ilms' && (
            <>
              <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
                  <User className="w-5 h-5" />
                  ILMS Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {audit.advisorName && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Advisor Name</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.advisorName}</p>
                    </div>
                  )}
                  {audit.advisorContact && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Advisor Contact</label>
                      <p className="m-0 flex items-center gap-2" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                        <Phone className="w-4 h-4 text-[#0AAE9A]" />
                        {audit.advisorContact}
                      </p>
                    </div>
                  )}
                  {audit.ambassadorName && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Ambassador Name</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.ambassadorName}</p>
                    </div>
                  )}
                  {audit.webInquiryDate && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Web Inquiry Date</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                        {new Date(audit.webInquiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {audit.webInquiryTime && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Web Inquiry Time</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.webInquiryTime}</p>
                    </div>
                  )}
                  {audit.visitDate && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Visit Date</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                        {new Date(audit.visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {audit.visitTime && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Visit Time</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.visitTime}</p>
                    </div>
                  )}
                  {audit.pincode && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Pincode</label>
                      <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.pincode}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* XFE Specific */}
          {audit.auditType === 'xfe' && (
            <>
              <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
                  <Phone className="w-5 h-5" />
                  XFE Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>XFE Name</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.xfeName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>XFE Number</label>
                    <p className="m-0 flex items-center gap-2" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                      <Phone className="w-4 h-4 text-[#0AAE9A]" />
                      {audit.xfeNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Call Date</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>
                      {audit.callDate ? new Date(audit.callDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>Call Time</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.callTime || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Management Team */}
          {(audit.tsm || audit.zsm || audit.zbm) && (
            <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
              <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
                <User className="w-5 h-5" />
                Management Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {audit.tsm && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>TSM</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.tsm}</p>
                  </div>
                )}
                {audit.zsm && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>ZSM</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.zsm}</p>
                  </div>
                )}
                {audit.zbm && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>ZBM</label>
                    <p className="m-0" style={{ color: '#111827', fontSize: '1rem', fontWeight: '600' }}>{audit.zbm}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Data Viewer - Show key questions/responses */}
          {audit.rawData && Object.keys(audit.rawData).length > 10 && (
            <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
              <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
                <CheckCircle className="w-5 h-5" />
                Detailed Responses ({Object.keys(audit.rawData).length} fields)
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {Object.entries(audit.rawData).map(([key, value], index) => {
                  // Skip empty values and metadata fields
                  if (!value || key.toLowerCase().includes('timestamp') || key.toLowerCase().includes('email')) return null;
                  
                  return (
                    <div key={index} className="border-b border-gray-200 pb-3">
                      <label className="block text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>{key}</label>
                      <p className="m-0 text-sm" style={{ color: '#111827' }}>{String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E0F7F4' }}>
            <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-4">
              {audit.timestamp && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E0F7F4' }}>
                    <FileText className="w-5 h-5" style={{ color: '#0AAE9A' }} />
                  </div>
                  <div className="flex-1">
                    <p className="m-0" style={{ color: '#111827', fontWeight: '600' }}>Audit Submitted</p>
                    <p className="m-0 text-sm" style={{ color: '#6B7280' }}>
                      {new Date(audit.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
              {audit.createdAt && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E0F7F4' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#0AAE9A' }} />
                  </div>
                  <div className="flex-1">
                    <p className="m-0" style={{ color: '#111827', fontWeight: '600' }}>Added to System</p>
                    <p className="m-0 text-sm" style={{ color: '#6B7280' }}>
                      {new Date(audit.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
              {audit.completedAt && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#22C55E' }} />
                  </div>
                  <div className="flex-1">
                    <p className="m-0" style={{ color: '#22C55E', fontWeight: '600' }}>Completed</p>
                    <p className="m-0 text-sm" style={{ color: '#6B7280' }}>
                      {new Date(audit.completedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl transition-all duration-300 border-2"
            style={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: '600' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
