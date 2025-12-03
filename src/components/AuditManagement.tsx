import { useState } from 'react';
import { ClipboardCheck, Plus, Upload, Filter, Search, Loader, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Audit, Auditor } from '../types';
import * as XLSX from 'xlsx';
import { parseAuditRow, detectAuditType } from '../utils/auditParser';
import { AuditDetailModal } from './AuditDetailModal';
import auditService, { CreateAuditData } from '../services/audit.service';

interface AuditManagementProps {
  audits?: Audit[];
  auditors?: Auditor[];
  onAddAudit?: (audit: CreateAuditData) => void;
  onBulkAddAudits?: (audits: CreateAuditData[]) => void;
  onAssignAudit?: (auditId: string, auditorId: string) => void;
  onUpdateAudit?: (auditId: string, updates: Partial<Audit>) => void;
}

export function AuditManagement({
  audits = [],
  auditors = [],
  onAddAudit = () => {},
  onBulkAddAudits = () => {},
  onAssignAudit = () => {},
  onUpdateAudit = () => {},
}: AuditManagementProps = {}) {
  // Debug: Log props on every render
  console.log('🔍 AuditManagement props:', { 
    auditsCount: audits.length, 
    auditorsCount: auditors.length,
    hasOnBulkAddAudits: !!onBulkAddAudits
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'store' | 'xfe' | 'ilms'>('all');
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    total: number;
    breakdown: string;
    errors: any[];
    parsingStats?: {
      totalRows: number;
      emptyRows: number;
      invalidRows: number;
      validRows: number;
    };
  } | null>(null);
  const [formData, setFormData] = useState({
    storeCode: '',
    storeName: '',
    location: '',
    auditType: 'store' as 'store' | 'ilms' | 'xfe',
    circle: '',
    deadline: '',
    status: 'unassigned' as 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed',
  });

  // PDF URLs for each audit type
  const pdfUrls = {
    store: 'https://drive.google.com/file/d/177V693rKUjGPDNGZa7qoSBivKUob1J3f/preview',
    xfe: 'https://drive.google.com/file/d/1fh-MfaVEecMpYZu_AGBPT3acxj9VFCvg/preview',
    ilms: 'https://drive.google.com/file/d/17rqGDxCBwDYDbI976J-I7ITbvyZGX-dv/preview'
  };

  // Function to open PDF in new tab
  const openPDF = (type: 'store' | 'xfe' | 'ilms') => {
    window.open(pdfUrls[type], '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onAddAudit({
        ...formData,
        deadline: new Date(formData.deadline),
      });
      toast.success('✅ Audit created successfully!');
      setFormData({
        storeCode: '',
        storeName: '',
        location: '',
        auditType: 'store',
        circle: '',
        deadline: '',
        status: 'unassigned',
      });
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create audit');
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name);
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        setUploading(true);
        let newAudits: CreateAuditData[] = [];
        let totalRows = 0;
        let emptyRows = 0;
        let invalidRows = 0;

        if (isExcel) {
          // Handle Excel files (.xls, .xlsx)
          console.log('📊 Parsing Excel file...');
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          console.log('📋 Total rows in Excel (including header):', jsonData.length);
          totalRows = jsonData.length - 1; // Exclude header
          
          // Get headers from first row
          const headers = jsonData[0] as string[];
          console.log('📑 Headers:', headers);
          
          // Detect audit type from headers
          const detectedType = detectAuditType(headers);
          console.log('🔍 Detected audit type:', detectedType);
          
          // Skip header row and process data
          const dataRows = jsonData.slice(1);
          
          newAudits = dataRows
            .map((row: any[], index: number) => {
              // REMOVED EMPTY ROW CHECK - Process ALL rows regardless of content
              // Only skip truly empty arrays
              if (!row || row.length === 0) {
                console.log(`⚪ Row ${index + 2}: Completely empty array - skipped`);
                return null;
              }
              
              // Use smart parser
              const parsed = parseAuditRow(row, headers, detectedType === 'unknown' ? undefined : detectedType);
              if (parsed) {
                // REMOVED VALIDATION - Extract all data without filtering
                // All rows are now included regardless of storeCode/storeName
                
                console.log(`✅ Row ${index + 2}: Parsed - ${parsed.auditType} - ${parsed.storeCode} - ${parsed.storeName}`);
                
                // Convert to CreateAuditData format
                return {
                  storeCode: parsed.storeCode,
                  storeName: parsed.storeName,
                  location: parsed.location,
                  auditType: parsed.auditType,
                  circle: parsed.circle,
                  deadline: parsed.deadline,
                  status: parsed.status,
                  score: parsed.score,
                  rawData: parsed.rawData,
                  pincode: parsed.pincode,
                  month: parsed.month,
                  year: parsed.year,
                } as CreateAuditData;
              }
              
              // If parser returned null, use fallback
              console.log(`⚠️ Row ${index + 2}: Parser returned null, using fallback - First 5 cells:`, row.slice(0, 5));
              invalidRows++;
              
              // Fallback to simple parser for basic format
              const [storeCode, storeName, location, auditType, circle, deadline] = row;
              
              // REMOVED VALIDATION - Extract all data without filtering
              
              console.log(`✅ Row ${index + 2}: Fallback parsed - ${storeCode || 'N/A'} - ${storeName || 'N/A'}`);
              
              return {
                storeCode: String(storeCode || `AUDIT-${Date.now()}`).trim(),
                storeName: String(storeName || 'Unknown').trim(),
                location: String(location || '').trim(),
                auditType: (String(auditType || 'store').toLowerCase().trim()) as 'store' | 'ilms' | 'xfe',
                circle: String(circle || '').trim(),
                deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'unassigned' as 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed',
              } as CreateAuditData;
            })
            .filter((audit): audit is CreateAuditData => audit !== null);
        } else {
          // Handle CSV/TXT files
          console.log('📄 Parsing CSV file...');
          const text = event.target?.result as string;
          const lines = text.split('\n').slice(1); // Skip header
          
          newAudits = lines
            .filter(line => line.trim())
            .map(line => {
              const delimiter = line.includes('\t') ? '\t' : ',';
              const parts = line.split(delimiter).map(part => part.trim().replace(/^"|"$/g, ''));
              
              const [storeCode, storeName, location, auditType, circle, deadline] = parts;
              
              return {
                storeCode: storeCode || `AUDIT-${Date.now()}`,
                storeName: storeName || 'Unknown',
                location: location || '',
                auditType: (auditType?.toLowerCase() || 'store') as 'store' | 'ilms' | 'xfe',
                circle: circle || '',
                deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'unassigned' as 'unassigned' | 'open' | 'in-progress' | 'at-risk' | 'completed',
              } as CreateAuditData;
            })
            .filter((audit): audit is CreateAuditData => {
              const isValid = audit !== null;
              if (!isValid) {
                console.log(`🚫 Filtered out null audit`);
              } else {
                console.log(`✅ Kept audit: ${audit.auditType} - ${audit.storeCode}`);
              }
              return isValid;
            });
        }

        console.log('📊 Final parsed audits count:', newAudits.length);
        console.log('📊 Audit types:', newAudits.map(a => a.auditType));

        if (newAudits.length === 0) {
          toast.error('❌ No valid audit data found in the file');
          setUploading(false);
          return;
        }

        // Log parsing summary
        console.log('📊 PARSING SUMMARY:');
        console.log(`   Total rows in file: ${totalRows}`);
        console.log(`   Empty rows skipped: ${emptyRows}`);
        console.log(`   Invalid rows skipped: ${invalidRows}`);
        console.log(`   Valid audits parsed: ${newAudits.length}`);
        console.log(`   Missing: ${totalRows - emptyRows - invalidRows - newAudits.length}`);

        // Show summary toast
        if (emptyRows > 0 || invalidRows > 0) {
          toast.warning(
            `⚠️ File parsing: ${newAudits.length} valid audits found. Skipped: ${emptyRows} empty rows, ${invalidRows} invalid rows (missing storeCode/storeName)`,
            { duration: 8000 }
          );
        }

        // newAudits is already in CreateAuditData format
        const auditDataArray: CreateAuditData[] = newAudits;

        console.log('🚀 Uploading', auditDataArray.length, 'audits to backend (NO DUPLICATE FILTERING)...');
        console.log('📋 All audits being sent:');
        auditDataArray.forEach((audit, idx) => {
          console.log(`   ${idx + 1}. ${audit.storeCode} - ${audit.storeName} (${audit.auditType})`);
        });

        // Call backend API to bulk create audits
        const result = await auditService.bulkCreateAudits(auditDataArray);
        
        console.log('📤 Backend response:', result);
        console.log('📤 Backend response structure:', JSON.stringify(result, null, 2));
        console.log('📊 UPLOAD SUMMARY:');
        console.log(`   ✅ Successfully saved: ${result.success} audits`);
        console.log(`   ❌ Failed to save: ${result.failed} audits`);
        console.log(`   📝 Sent to backend: ${auditDataArray.length} audits`);
        console.log(`   ⚠️  Discrepancy: ${auditDataArray.length - result.success - result.failed} audits unaccounted for`);
        
        // Log EVERY audit that was sent and what happened
        console.log('\n🔍 DETAILED AUDIT-BY-AUDIT BREAKDOWN:');
        auditDataArray.forEach((audit, idx) => {
          const savedAudit = result.audits?.find((a: any) => a.storeCode === audit.storeCode);
          const failedAudit = result.errors?.find((e: any) => e.storeCode === audit.storeCode);
          
          if (savedAudit) {
            console.log(`   ✅ #${idx + 1}: ${audit.storeCode} - ${audit.storeName} → SAVED (ID: ${savedAudit._id})`);
          } else if (failedAudit) {
            console.log(`   ❌ #${idx + 1}: ${audit.storeCode} - ${audit.storeName} → FAILED: ${failedAudit.error}`);
          } else {
            console.log(`   ⚠️ #${idx + 1}: ${audit.storeCode} - ${audit.storeName} → UNKNOWN STATUS`);
          }
        });
        console.log('\n');
        
        if (result.failed > 0 && result.errors) {
          console.error('💥 FAILED AUDIT DETAILS:');
          result.errors.forEach((err: any) => {
            console.error(`   - Audit #${err.index}: ${err.storeCode} - ${err.storeName}`);
            console.error(`     Error: ${err.error}`);
          });
        }

        setUploading(false);
        
        // Count by type
        const byType = newAudits.reduce((acc, audit) => {
          acc[audit.auditType] = (acc[audit.auditType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const typeBreakdown = Object.entries(byType)
          .map(([type, count]) => `${count} ${type.toUpperCase()}`)
          .join(', ');
        
        // Don't show modal - just show enhanced toast notifications
        if (result.failed > 0) {
          toast.error(
            `❌ Saved ${result.success}/${newAudits.length} audits to database. ${result.failed} failed (check console for details)`,
            { duration: 10000 }
          );
          console.error('❌ Failed uploads:', result.errors);
        } else if (result.success < newAudits.length) {
          // Some audits silently failed (probably duplicates)
          // toast.warning(
          //   `⚠️ Saved ${result.success}/${newAudits.length} audits to database. ${newAudits.length - result.success} were skipped (likely duplicates)`,
          //   { duration: 10000 }
          // );
        } else {
          // toast.success(
          //   `✅ Successfully saved ${result.success} audits to database! (${typeBreakdown})`,
          //   { duration: 7000 }
          // );
        }

        // Close the bulk upload panel
        setShowBulkUpload(false);

        // Call callback to refresh data from backend
        console.log('🔄 Refreshing audits list from backend...');
        if (onBulkAddAudits) {
          await onBulkAddAudits(newAudits);
          console.log('✅ Audits list refreshed!');
        }
        
      } catch (error: any) {
        console.error('❌ Upload error:', error);
        setUploading(false);
        toast.error(error.message || 'Failed to upload audits');
      }
    };

    reader.onerror = () => {
      console.error('❌ File read error');
      toast.error('Failed to read file');
      setUploading(false);
    };

    // Read file based on type
    if (isExcel) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
    
    // Reset input
    e.target.value = '';
  };

  const downloadTemplate = (format: 'csv' | 'excel' = 'csv') => {
    if (format === 'excel') {
      // Create Excel template
      const templateData = [
        ['StoreCode', 'StoreName', 'Location', 'AuditType', 'Circle', 'Deadline'],
        ['STR001', 'Downtown Branch', 'Mumbai', 'store', 'Mum', '2024-12-15'],
        ['STR002', 'North Plaza Store', 'Delhi', 'store', 'DEL', '2024-12-20'],
        ['STR003', 'East Mall Branch', 'Kolkata', 'ilms', 'KK', '2024-12-18'],
        ['STR004', 'West Center Store', 'Gujarat', 'xfe', 'Guj', '2024-12-25'],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Audits');
      XLSX.writeFile(workbook, 'audit_upload_template.xlsx');
    } else {
      // Create CSV template
      const template = `StoreCode,StoreName,Location,AuditType,Circle,Deadline
STR001,Downtown Branch,Mumbai,store,Mum,2024-12-15
STR002,North Plaza Store,Delhi,store,DEL,2024-12-20
STR003,East Mall Branch,Kolkata,ilms,KK,2024-12-18
STR004,West Center Store,Gujarat,xfe,Guj,2024-12-25`;

      const blob = new Blob([template], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const filteredAudits = audits.filter(audit => {
    const matchesStatus = filterStatus === 'all' || audit.status === filterStatus;
    const matchesSearch = 
      audit.storeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || audit.auditType === activeTab;
    return matchesStatus && matchesSearch && matchesTab;
  });

  // Calculate counts for each audit type
  const auditTypeCounts = {
    all: audits.length,
    store: audits.filter(a => a.auditType === 'store').length,
    xfe: audits.filter(a => a.auditType === 'xfe').length,
    ilms: audits.filter(a => a.auditType === 'ilms').length,
  };

  const getStatusColor = (status: Audit['status']) => {
    switch (status) {
      case 'completed': return '#22C55E';
      case 'at-risk': return '#FBBF24';
      case 'in-progress': return '#2563EB';
      case 'open': return '#0AAE9A';
      case 'unassigned': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusBg = (status: Audit['status']) => {
    switch (status) {
      case 'completed': return 'rgba(34, 197, 94, 0.1)';
      case 'at-risk': return 'rgba(251, 191, 36, 0.1)';
      case 'in-progress': return 'rgba(37, 99, 235, 0.1)';
      case 'open': return '#E0F7F4';
      case 'unassigned': return 'rgba(107, 114, 128, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const auditStats = {
    total: audits.length,
    unassigned: audits.filter(a => a.status === 'unassigned').length,
    open: audits.filter(a => a.status === 'open').length,
    inProgress: audits.filter(a => a.status === 'in-progress').length,
    atRisk: audits.filter(a => a.status === 'at-risk').length,
    completed: audits.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 rounded-2xl shadow-lg" style={{ background: '#E0F7F4' }}>
              <ClipboardCheck className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#0AAE9A' }} />
            </div>
            <div>
              <h2 className="mb-1" style={{ color: '#111827', fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: '700', letterSpacing: '-0.03em' }}>Audit Management</h2>
              <p className="m-0 text-base sm:text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>Create and manage audit assignments with Store/ILMS/XFE data</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Manual Add Audit - Hidden for now */}
            {/* <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-5 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)', fontWeight: '600' }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Audit</span>
            </button> */}
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
              style={{ borderColor: '#0AAE9A', color: '#0AAE9A', backgroundColor: 'white', fontWeight: '600', opacity: uploading ? 0.5 : 1 }}
            >
              {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span>{uploading ? 'Uploading...' : 'Bulk Upload'}</span>
            </button>
          </div>
        </div>

        {/* Audit Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0AAE9A' }}>{auditStats.total}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Total Audits</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#6B7280' }}>{auditStats.unassigned}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Unassigned</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0AAE9A' }}>{auditStats.open}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Open</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563EB' }}>{auditStats.inProgress}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#FBBF24' }}>{auditStats.atRisk}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>At Risk</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-[#E5E7EB]">
            <div className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#22C55E' }}>{auditStats.completed}</div>
            <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Completed</div>
          </div>
        </div>

        {/* Add Audit Form - Hidden for now */}
        {/* {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#E5E7EB]">
            <h3 className="mb-5" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>Create New Audit</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Store Code *</label>
                  <input
                    type="text"
                    value={formData.storeCode}
                    onChange={(e) => setFormData({ ...formData, storeCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g., STR001"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Store Name *</label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g., Downtown Branch"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="e.g., Mumbai"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Audit Type *</label>
                  <select
                    value={formData.auditType}
                    onChange={(e) => setFormData({ ...formData, auditType: e.target.value as 'store' | 'ilms' | 'xfe' })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="store">Store Audit (150+ fields)</option>
                    <option value="ilms">ILMS Audit (60+ fields)</option>
                    <option value="xfe">XFE Audit (40+ fields)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Circle *</label>
                  <select
                    value={formData.circle}
                    onChange={(e) => setFormData({ ...formData, circle: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  >
                    <option value="">Select Circle</option>
                    <option value="AP">AP</option>
                    <option value="BH">BH</option>
                    <option value="DEL">DEL</option>
                    <option value="Guj">Guj</option>
                    <option value="HR">HR</option>
                    <option value="JK">JK</option>
                    <option value="KER">KER</option>
                    <option value="KK">KK</option>
                    <option value="MPCG">MPCG</option>
                    <option value="Mum">Mum</option>
                    <option value="NESA">NESA</option>
                    <option value="OR">OR</option>
                    <option value="PB">PB</option>
                    <option value="RAJ">RAJ</option>
                    <option value="ROM">ROM</option>
                    <option value="TN">TN</option>
                    <option value="UPE">UPE</option>
                    <option value="UPW">UPW</option>
                    <option value="WB">WB</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: '#E5E7EB', color: '#111827' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0AAE9A';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)', fontWeight: '600' }}
                >
                  Create Audit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border-2 rounded-xl transition-all duration-300"
                  style={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )} */}

        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="m-0" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>Bulk Upload Audits (Store/ILMS/XFE)</h3>
              <div className="flex gap-2">
              
               
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="px-4 py-2 rounded-lg text-sm transition-all duration-300 border-2"
                  style={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: '600' }}
                  disabled={uploading}
                >
                  ✕ Close
                </button>
              </div>
            </div>
            
            <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: '#0AAE9A', backgroundColor: '#E0F7F4' }}>
              {uploading ? (
                <div className="py-8">
                  <Loader className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#0AAE9A' }} />
                  <p className="mb-2" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Uploading and saving to MongoDB...</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Extracting Store/ILMS/XFE audit data with all fields</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: '#0AAE9A' }} />
                  <p className="mb-2" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Upload Excel or CSV with Store/ILMS/XFE audit data</p>
                
               

                  <div className="mb-4 text-left bg-white rounded-lg p-4" style={{ border: '1px solid #E5E7EB' }}>
                    <p className="text-xs mb-2" style={{ color: '#0AAE9A', fontWeight: '700', textTransform: 'uppercase' }}>Supported Audit Types:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', fontWeight: '700' }}>Store</span>
                      <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', fontWeight: '700' }}>ILMS</span>
                      <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#F97316', fontWeight: '700' }}>XFE</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx,.txt"
                    onChange={handleBulkUpload}
                    className="hidden"
                    id="bulk-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="bulk-upload"
                    className="inline-block px-8 py-3 text-white rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)', fontWeight: '600', fontSize: '1rem' }}
                  >
                    Choose File to Upload
                  </label>
                  
                 
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload Results Modal - DISABLED */}
        {false && uploadResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header - Fixed */}
              <div className="p-6 border-b border-[#E5E7EB] bg-white">
                <h3 className="m-0 flex items-center gap-3" style={{ color: '#0AAE9A', fontSize: '1.5rem', fontWeight: '700' }}>
                  {uploadResult.failed === 0 ? (
                    <>
                      <span className="text-3xl">✅</span>
                      Upload Successful!
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">⚠️</span>
                      Upload Completed with Warnings
                    </>
                  )}
                </h3>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Parsing Summary */}
                {uploadResult.parsingStats && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
                    <h4 className="mb-4 flex items-center gap-2" style={{ color: '#2563EB', fontWeight: '700', fontSize: '1.2rem' }}>
                      <span className="text-2xl">📊</span>
                      Excel File Parsing Summary
                    </h4>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-5">
                      <div className="bg-white rounded-xl p-4 text-center shadow-md border border-blue-200">
                        <div className="text-3xl mb-2" style={{ color: '#3B82F6', fontWeight: '800' }}>
                          {uploadResult.parsingStats.totalRows}
                        </div>
                        <div className="text-sm" style={{ color: '#6B7280', fontWeight: '600' }}>
                          Total Rows
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                          in Excel file
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 text-center shadow-md border border-green-200">
                        <div className="text-3xl mb-2" style={{ color: '#22C55E', fontWeight: '800' }}>
                          {uploadResult.parsingStats.validRows}
                        </div>
                        <div className="text-sm" style={{ color: '#6B7280', fontWeight: '600' }}>
                          ✅ Valid
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                          ready to save
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 text-center shadow-md border border-gray-200">
                        <div className="text-3xl mb-2" style={{ color: '#9CA3AF', fontWeight: '800' }}>
                          {uploadResult.parsingStats.emptyRows}
                        </div>
                        <div className="text-sm" style={{ color: '#6B7280', fontWeight: '600' }}>
                          ⚪ Empty
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                          blank rows
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 text-center shadow-md border border-red-200">
                        <div className="text-3xl mb-2" style={{ color: '#EF4444', fontWeight: '800' }}>
                          {uploadResult.parsingStats.invalidRows}
                        </div>
                        <div className="text-sm" style={{ color: '#6B7280', fontWeight: '600' }}>
                          ❌ Invalid
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                          missing data
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <div className="flex-1">
                          <p className="m-0 mb-3" style={{ color: '#2563EB', fontWeight: '700', fontSize: '1rem' }}>
                            Why were {uploadResult.parsingStats.emptyRows + uploadResult.parsingStats.invalidRows} rows skipped?
                          </p>
                          <div className="space-y-2">
                            {uploadResult.parsingStats.emptyRows > 0 && (
                              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                <span className="text-lg flex-shrink-0">⚪</span>
                                <div>
                                  <div style={{ color: '#111827', fontWeight: '700' }}>
                                    {uploadResult.parsingStats.emptyRows} Empty Rows
                                  </div>
                                  <div className="text-sm" style={{ color: '#6B7280' }}>
                                    Completely blank rows (no data at all)
                                  </div>
                                </div>
                              </div>
                            )}
                            {uploadResult.parsingStats.invalidRows > 0 && (
                              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                                <span className="text-lg flex-shrink-0">❌</span>
                                <div>
                                  <div style={{ color: '#EF4444', fontWeight: '700' }}>
                                    {uploadResult.parsingStats.invalidRows} Invalid Rows
                                  </div>
                                  <div className="text-sm" style={{ color: '#6B7280' }}>
                                    Missing required fields (Store Code or Store Name)
                                  </div>
                                </div>
                              </div>
                            )}
                            {uploadResult.parsingStats.emptyRows === 0 && uploadResult.parsingStats.invalidRows === 0 && (
                              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                                <span className="text-lg flex-shrink-0">🎉</span>
                                <div>
                                  <div style={{ color: '#22C55E', fontWeight: '700' }}>
                                    Perfect! All rows were valid!
                                  </div>
                                  <div className="text-sm" style={{ color: '#6B7280' }}>
                                    No rows were skipped
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#DBEAFE', border: '1px solid #93C5FD' }}>
                            <div className="text-sm" style={{ color: '#1E40AF' }}>
                              <strong>💡 Pro Tip:</strong> Open browser console (F12) to see exact row numbers that were skipped
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Database Upload Results */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                  <h4 className="mb-4 flex items-center gap-2" style={{ color: '#22C55E', fontWeight: '700', fontSize: '1.2rem' }}>
                    <span className="text-2xl">💾</span>
                    Database Upload Results
                  </h4>
                  
                  {/* Upload Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-white rounded-xl p-5 text-center shadow-md border border-green-200">
                      <div className="text-4xl mb-2" style={{ color: '#22C55E', fontWeight: '800' }}>
                        {uploadResult.success}
                      </div>
                      <div className="text-sm mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>
                        Successfully Saved
                      </div>
                     
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 text-center shadow-md border border-red-200">
                      <div className="text-4xl mb-2" style={{ color: '#EF4444', fontWeight: '800' }}>
                        {uploadResult.failed}
                      </div>
                      <div className="text-sm mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>
                        Failed to Save
                      </div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        database errors
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 text-center shadow-md border border-blue-200">
                      <div className="text-4xl mb-2" style={{ color: '#3B82F6', fontWeight: '800' }}>
                        {uploadResult.total}
                      </div>
                      <div className="text-sm mb-1" style={{ color: '#6B7280', fontWeight: '700' }}>
                        📊 Total Processed
                      </div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        valid audits
                      </div>
                    </div>
                  </div>

                  {/* Type Breakdown */}
                  {uploadResult.breakdown && (
                    <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📋</span>
                        <span style={{ color: '#22C55E', fontWeight: '700' }}>Breakdown by Audit Type:</span>
                      </div>
                      <div className="text-lg" style={{ color: '#111827', fontWeight: '600' }}>
                        {uploadResult.breakdown}
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Details */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 mb-6">
                    <h4 className="mb-4 flex items-center gap-2" style={{ color: '#EF4444', fontWeight: '700', fontSize: '1.2rem' }}>
                      <span className="text-2xl">⚠️</span>
                      Database Save Errors ({uploadResult.errors.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {uploadResult.errors.map((error, idx) => (
                        <div key={idx} className="bg-white border-2 border-red-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">❌</span>
                            <div className="flex-1 min-w-0">
                              <div className="mb-1" style={{ color: '#111827', fontWeight: '700' }}>
                                Audit #{idx + 1}: {error.storeName || error.storeCode || 'Unknown Store'}
                              </div>
                              <div className="text-sm p-2 rounded" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
                                {error.error}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {uploadResult.failed === 0 && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl p-5 text-center mb-6">
                    <div className="text-4xl mb-3">🎉</div>
                    <div className="text-xl mb-2" style={{ color: '#22C55E', fontWeight: '700' }}>
                      Perfect Upload!
                    </div>
                    <div style={{ color: '#6B7280' }}>
                      All valid audits were successfully saved to MongoDB database
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Sticky Footer */}
              <div className="p-6 border-t border-[#E5E7EB] bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setUploadResult(null);
                      setShowBulkUpload(false);
                      if (onBulkAddAudits) {
                        onBulkAddAudits([]);
                      }
                    }}
                    className="flex-1 px-6 py-4 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)', fontWeight: '700', fontSize: '1.1rem' }}
                  >
                    ✅ Close & Refresh Dashboard
                  </button>
                  <button
                    onClick={() => setUploadResult(null)}
                    className="px-6 py-4 rounded-xl transition-all duration-300 border-2"
                    style={{ borderColor: '#E5E7EB', color: '#6B7280', fontWeight: '600' }}
                  >
                    Close Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Type Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#E5E7EB]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#0AAE9A' }}></div>
            <h3 className="m-0" style={{ color: '#111827', fontSize: '1.15rem', fontWeight: '700' }}>Filter by Audit Type</h3>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {/* All Tab */}
            <button
              onClick={() => setActiveTab('all')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
              style={{
                background: activeTab === 'all' ? 'linear-gradient(135deg, #0AAE9A, #078672)' : 'white',
                color: activeTab === 'all' ? 'white' : '#6B7280',
                border: activeTab === 'all' ? 'none' : '2px solid #E5E7EB',
                fontWeight: '700',
              }}
            >
              <span>All Audits</span>
              <span
                className="px-2.5 py-0.5 rounded-lg text-xs"
                style={{
                  backgroundColor: activeTab === 'all' ? 'rgba(255, 255, 255, 0.25)' : '#E0F7F4',
                  color: activeTab === 'all' ? 'white' : '#0AAE9A',
                  fontWeight: '700',
                }}
              >
                {auditTypeCounts.all}
              </span>
            </button>

            {/* Store Tab */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('store')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{
                  background: activeTab === 'store' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'white',
                  color: activeTab === 'store' ? 'white' : '#6B7280',
                  border: activeTab === 'store' ? 'none' : '2px solid #E5E7EB',
                  fontWeight: '700',
                }}
              >
                <span>STORE</span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-xs"
                  style={{
                    backgroundColor: activeTab === 'store' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(37, 99, 235, 0.1)',
                    color: activeTab === 'store' ? 'white' : '#2563EB',
                    fontWeight: '700',
                  }}
                >
                  {auditTypeCounts.store}
                </span>
              </button>
              {activeTab === 'store' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPDF('store');
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563EB',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Report</span>
                </button>
              )}
            </div>

            {/* XFE Tab */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('xfe')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{
                  background: activeTab === 'xfe' ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'white',
                  color: activeTab === 'xfe' ? 'white' : '#6B7280',
                  border: activeTab === 'xfe' ? 'none' : '2px solid #E5E7EB',
                  fontWeight: '700',
                }}
              >
                <span>XFE</span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-xs"
                  style={{
                    backgroundColor: activeTab === 'xfe' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(249, 115, 22, 0.1)',
                    color: activeTab === 'xfe' ? 'white' : '#F97316',
                    fontWeight: '700',
                  }}
                >
                  {auditTypeCounts.xfe}
                </span>
              </button>
              {activeTab === 'xfe' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPDF('xfe');
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                  style={{
                    background: 'rgba(249, 115, 22, 0.1)',
                    color: '#F97316',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Report</span>
                </button>
              )}
            </div>

            {/* ILMS Tab */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('ilms')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                style={{
                  background: activeTab === 'ilms' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'white',
                  color: activeTab === 'ilms' ? 'white' : '#6B7280',
                  border: activeTab === 'ilms' ? 'none' : '2px solid #E5E7EB',
                  fontWeight: '700',
                }}
              >
                <span>ILMS</span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-xs"
                  style={{
                    backgroundColor: activeTab === 'ilms' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(34, 197, 94, 0.1)',
                    color: activeTab === 'ilms' ? 'white' : '#22C55E',
                    fontWeight: '700',
                  }}
                >
                  {auditTypeCounts.ilms}
                </span>
              </button>
              {activeTab === 'ilms' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPDF('ilms');
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Show Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
                <input
                  type="text"
                  placeholder="Search by store code, name, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: '#E5E7EB', color: '#111827' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none"
                  style={{ borderColor: '#E5E7EB', color: '#111827' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0AAE9A';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="at-risk">At Risk</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Audits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAudits.length === 0 ? (
            <div className="col-span-full text-center py-12" style={{ color: '#6B7280' }}>
              <ClipboardCheck className="w-16 h-16 mx-auto mb-4" style={{ color: '#E5E7EB' }} />
              <p className="text-lg">No audits found</p>
              <p className="text-sm">Try uploading an Excel file with audit data</p>
            </div>
          ) : (
            filteredAudits.map((audit) => (
              <div
                key={audit._id}
                onClick={() => setSelectedAudit(audit)}
                className="bg-white rounded-2xl shadow-lg p-5 border-2 border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '700' }}>{audit.storeName}</h3>
                    <p className="text-sm" style={{ color: '#6B7280', fontWeight: '600' }}>{audit.storeCode}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: getStatusBg(audit.status),
                      color: getStatusColor(audit.status),
                      fontWeight: '700',
                    }}
                  >
                    {audit.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                    <span className="font-semibold">Type:</span>
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#E0F7F4', color: '#0AAE9A', fontWeight: '600' }}>
                      {audit.auditType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                    <span className="font-semibold">Circle:</span>
                    <span>{audit.circle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                    <span className="font-semibold">Location:</span>
                    <span>{audit.location}</span>
                  </div>
                  {audit.score !== undefined && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                      <span className="font-semibold">Score:</span>
                      <span style={{ color: audit.score >= 70 ? '#22C55E' : audit.score >= 50 ? '#FBBF24' : '#EF4444', fontWeight: '700' }}>
                        {audit.score}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#9CA3AF' }}>
                    <span>Deadline: {new Date(audit.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <AuditDetailModal
          audit={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}
    </div>
  );
}