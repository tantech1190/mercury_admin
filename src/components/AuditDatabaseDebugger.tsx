import { useState } from 'react';
import { Database, RefreshCw, Trash2 } from 'lucide-react';
import auditService from '../services/audit.service';
import { toast } from 'sonner@2.0.3';

export function AuditDatabaseDebugger() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAllAudits();
      setAudits(response.audits || []);
      toast.success(`✅ Loaded ${response.audits?.length || 0} audits from database`);
    } catch (error: any) {
      toast.error('Failed to load audits: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAudit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audit?')) return;
    
    try {
      await auditService.deleteAudit(id);
      toast.success('✅ Audit deleted');
      loadAudits();
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  if (!showDebugger) {
    return (
      <button
        onClick={() => {
          setShowDebugger(true);
          loadAudits();
        }}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
        title="Database Debugger"
      >
        <Database className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Database Debugger</h2>
                <p className="text-sm text-gray-600">MongoDB Audits Collection</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadAudits}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowDebugger(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <div className="text-lg font-bold text-blue-900">
              📊 Total Audits in Database: {audits.length}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              By Type: 
              {' '}STORE: {audits.filter(a => a.auditType === 'store').length}
              {' '}| XFE: {audits.filter(a => a.auditType === 'xfe').length}
              {' '}| ILMS: {audits.filter(a => a.auditType === 'ilms').length}
            </div>
          </div>

          <div className="space-y-3">
            {audits.map((audit, idx) => (
              <div key={audit._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        #{idx + 1}: {audit.storeName}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                        {audit.auditType?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                        {audit.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>Store Code:</strong> {audit.storeCode}</div>
                      <div><strong>Location:</strong> {audit.location}</div>
                      <div><strong>Circle:</strong> {audit.circle}</div>
                      <div><strong>ID:</strong> <code className="text-xs bg-gray-100 px-1">{audit._id}</code></div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAudit(audit._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete audit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {audits.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No audits in database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
