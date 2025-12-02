import { X, Eye, List, Calendar, MapPin, User, Building2, Phone, Star, Award } from 'lucide-react';
import { Audit } from '../types';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  auditType: string;
}

export function PDFModal({ isOpen, onClose, pdfUrl, auditType }: PDFModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: '#E0F7F4' }}>
              <Eye className="w-6 h-6" style={{ color: '#0AAE9A' }} />
            </div>
            <div>
              <h2 className="m-0" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '800' }}>
                {auditType.toUpperCase()} Audit PDF Guide
              </h2>
              <p className="m-0 mt-1 text-sm" style={{ color: '#6B7280', fontWeight: '500' }}>
                Reference documentation for {auditType} audits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={`${auditType} PDF`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-200 flex justify-end gap-3">
          <a
            href={pdfUrl}
            download
            className="px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ background: '#E0F7F4', color: '#0AAE9A', fontWeight: '700' }}
          >
            <Eye className="w-5 h-5" />
            Download PDF
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl transition-all"
            style={{ background: '#F3F4F6', color: '#6B7280', fontWeight: '700' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface AuditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  audits: Audit[];
  title: string;
}

export function AuditListModal({ isOpen, onClose, audits, title }: AuditListModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', text: '#166534' };
      case 'in-progress': return { bg: '#dbeafe', text: '#1e40af' };
      case 'pending': return { bg: '#fed7aa', text: '#9a3412' };
      case 'unassigned': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#22C55E';
    if (score >= 70) return '#FBBF24';
    return '#EF4444';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: '#E0F7F4' }}>
              <List className="w-6 h-6" style={{ color: '#0AAE9A' }} />
            </div>
            <div>
              <h2 className="m-0" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '800' }}>
                {title}
              </h2>
              <p className="m-0 mt-1 text-sm" style={{ color: '#6B7280', fontWeight: '500' }}>
                {audits.length} audit{audits.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Audit List */}
        <div className="flex-1 overflow-y-auto p-6">
          {audits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-6 rounded-3xl mb-4" style={{ background: '#F3F4F6' }}>
                <List className="w-16 h-16" style={{ color: '#9CA3AF' }} />
              </div>
              <p style={{ color: '#6B7280', fontSize: '1.125rem', fontWeight: '600' }}>
                No audits found
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {audits.map((audit, index) => {
                const statusStyle = getStatusColor(audit.status);
                return (
                  <div 
                    key={audit._id || index}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Side - Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="px-3 py-1 rounded-lg" style={{ background: '#E0F7F4', color: '#0AAE9A', fontWeight: '800' }}>
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="m-0 mb-1" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
                              {audit.storeName || audit.xfeName || audit.ambassadorName || 'N/A'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              {audit.storeCode && (
                                <span className="flex items-center gap-1" style={{ color: '#6B7280', fontWeight: '600' }}>
                                  <Building2 className="w-4 h-4" />
                                  {audit.storeCode}
                                </span>
                              )}
                              {audit.circle && (
                                <span className="flex items-center gap-1" style={{ color: '#6B7280', fontWeight: '600' }}>
                                  <MapPin className="w-4 h-4" />
                                  {audit.circle}
                                </span>
                              )}
                              {audit.month && audit.year && (
                                <span className="flex items-center gap-1" style={{ color: '#6B7280', fontWeight: '600' }}>
                                  <Calendar className="w-4 h-4" />
                                  {audit.month} {audit.year}
                                </span>
                              )}
                              {(audit.croName || audit.xfeName || audit.ambassadorName) && (
                                <span className="flex items-center gap-1" style={{ color: '#6B7280', fontWeight: '600' }}>
                                  <User className="w-4 h-4" />
                                  {audit.croName || audit.xfeName || audit.ambassadorName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Status & Score */}
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>Status</div>
                          <span 
                            className="px-4 py-2 rounded-lg text-sm inline-block"
                            style={{ 
                              background: statusStyle.bg, 
                              color: statusStyle.text,
                              fontWeight: '700'
                            }}
                          >
                            {audit.status?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                        
                        {audit.score !== undefined && audit.score !== null && (
                          <div className="text-center">
                            <div className="text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>Score</div>
                            <div 
                              className="px-4 py-2 rounded-lg"
                              style={{ 
                                background: `${getScoreColor(audit.score)}20`,
                                color: getScoreColor(audit.score)
                              }}
                            >
                              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                                {audit.score}
                              </span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>%</span>
                            </div>
                          </div>
                        )}

                        {audit.qcStatus && (
                          <div className="text-center">
                            <div className="text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>QC</div>
                            <Award 
                              className="w-8 h-8" 
                              style={{ 
                                color: audit.qcStatus === 'done' ? '#22C55E' : '#F97316' 
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-200 flex justify-between items-center">
          <div style={{ color: '#6B7280', fontWeight: '600' }}>
            Total: <span style={{ color: '#0AAE9A', fontWeight: '800' }}>{audits.length}</span> audits
          </div>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl transition-all"
            style={{ background: '#0AAE9A', color: 'white', fontWeight: '700' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
