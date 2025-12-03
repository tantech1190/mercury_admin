import { useState, useEffect } from 'react';
import { Plus, Mail, Phone, MapPin, FileCheck, Users, Upload, Trash2, Edit, RefreshCw, Filter, Database, UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as XLSX from 'xlsx';
import { AuditorForm } from './AuditorForm';
import auditorService, { Auditor, CreateAuditorData } from '../services/auditor.service';
import auditService from '../services/audit.service';

// Removed ViewMode - now using unified view

interface AuditAuditor {
  name: string;
  count: number;
  circles: string[];
  averageScore: number;
  totalScore: number;
  auditTypes: string[];
}

interface AuditorMetrics {
  [auditorName: string]: {
    totalAssigned: number;
    totalCompleted: number;
    averageScore: number;
    totalScore: number;
    auditCount: number;
    auditTypes: string[];
  };
}

export function AuditorManagement() {
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [auditAuditors, setAuditAuditors] = useState<AuditAuditor[]>([]);
  const [auditorMetrics, setAuditorMetrics] = useState<AuditorMetrics>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingAuditor, setEditingAuditor] = useState<Auditor | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Removed viewMode - now showing unified view

  // Calculate metrics for all auditors from audits
  const calculateAuditorMetrics = async () => {
    try {
      console.log('🔢 Calculating auditor metrics from audits...');
      const { audits } = await auditService.getAllAudits({ limit: 10000 });
      console.log(`📊 Fetched ${audits.length} audits for metrics calculation`);
      
      const metrics: AuditorMetrics = {};
      
      // Helper function to normalize names for matching
      const normalizeName = (name: string) => {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
      };
      
      audits.forEach((audit: any) => {
        // Try to get auditor name - check rawData first for all audit types
        let auditorName = '';
        
        // First, check rawData for auditor name (works for all audit types)
        if (audit.rawData) {
          auditorName = audit.rawData['Name of Auditor'] || 
                       audit.rawData['Name of auditor'] || 
                       audit.rawData['Auditor Name'] ||
                       audit.rawData['Name of the CRO/Executive'] || 
                       audit.rawData.auditor || 
                       audit.rawData.auditorName || '';
        }
        
        // If not found in rawData and it's XFE audit, use storeName as fallback
        // Note: For ILMS, storeName is the ambassador, not the auditor!
        if (!auditorName && audit.auditType === 'xfe') {
          auditorName = audit.storeName;
        }
        
        if (!auditorName || typeof auditorName !== 'string') {
          console.log('⚠️ No auditor name found for audit:', audit._id, audit.auditType);
          return;
        }
        
        // Normalize the name for consistent matching
        const normalizedName = normalizeName(auditorName);
        
        if (!metrics[normalizedName]) {
          metrics[normalizedName] = {
            totalAssigned: 0,
            totalCompleted: 0,
            averageScore: 0,
            totalScore: 0,
            auditCount: 0,
            auditTypes: []
          };
        }
        
        // Track audit types
        if (audit.auditType && !metrics[normalizedName].auditTypes.includes(audit.auditType.toUpperCase())) {
          metrics[normalizedName].auditTypes.push(audit.auditType.toUpperCase());
        }
        
        // Count as assigned
        metrics[normalizedName].totalAssigned++;
        
        // If completed, count it and add score
        if (audit.status === 'completed' && audit.score !== undefined && audit.score !== null) {
          metrics[normalizedName].totalCompleted++;
          metrics[normalizedName].totalScore += audit.score;
          metrics[normalizedName].auditCount++;
        }
      });
      
      // Calculate average scores
      Object.keys(metrics).forEach(name => {
        if (metrics[name].auditCount > 0) {
          metrics[name].averageScore = Math.round(metrics[name].totalScore / metrics[name].auditCount);
        }
      });
      
      console.log('✅ Calculated metrics for auditors:', Object.keys(metrics));
      console.log('✅ Sample metrics:', Object.keys(metrics).length > 0 ? { [Object.keys(metrics)[0]]: metrics[Object.keys(metrics)[0]] } : 'No metrics');
      setAuditorMetrics(metrics);
    } catch (error: any) {
      console.error('❌ Error calculating metrics:', error);
    }
  };

  // Fetch all auditors from the auditor collection
  const fetchAuditors = async () => {
    try {
      setLoading(true);
      const data = await auditorService.getAllAuditors();
      console.log('📊 Fetched auditors from database:', data);
      if (data && data.length > 0) {
        console.log('📊 Sample auditor data:', data[0]);
        console.log('📊 Auditor fields:', {
          name: data[0].name,
          averageScore: data[0].averageScore,
          totalAuditsAssigned: data[0].totalAuditsAssigned,
          totalAuditsCompleted: data[0].totalAuditsCompleted,
          performanceMetrics: data[0].performanceMetrics
        });
      }
      setAuditors(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch auditors');
      console.error('Fetch auditors error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch auditors from audits and save to database
  const fetchAuditorsFromAudits = async () => {
    try {
      console.log('🔍 Fetching audits from API...');
      const { audits } = await auditService.getAllAudits({ limit: 1000 }); // Get more audits
      
      console.log(`📊 Fetched ${audits.length} audits from API`);
      console.log('📋 Sample audit data:', audits[0]);
      
      // Extract unique auditor names and their info with scoring
      const auditorMap = new Map<string, { 
        name: string; 
        count: number; 
        circles: Set<string>; 
        totalScore: number;
        auditTypes: Set<string>;
      }>();
      
      audits.forEach(audit => {
        // Try to get auditor name from multiple possible locations
        let auditorName = audit.auditorName;
        
        // If not found at top level, check rawData
        if (!auditorName && audit.rawData) {
          auditorName = audit.rawData['Name of Auditor'] || 
                       audit.rawData['Name of auditor'] || 
                       audit.rawData['Auditor Name'] ||
                       audit.rawData['auditorName'];
        }
        
        if (auditorName && typeof auditorName === 'string' && auditorName.trim()) {
          const name = auditorName.trim();
          const score = audit.score || 0;
          
          if (auditorMap.has(name)) {
            const existing = auditorMap.get(name)!;
            existing.count++;
            existing.totalScore += score;
            if (audit.circle) existing.circles.add(audit.circle);
            if (audit.auditType) existing.auditTypes.add(audit.auditType.toUpperCase());
          } else {
            auditorMap.set(name, {
              name,
              count: 1,
              circles: audit.circle ? new Set([audit.circle]) : new Set(),
              totalScore: score,
              auditTypes: audit.auditType ? new Set([audit.auditType.toUpperCase()]) : new Set()
            });
          }
        }
      });

      // Convert to array with average score
      const auditorsFromAudits: AuditAuditor[] = Array.from(auditorMap.values()).map(item => ({
        name: item.name,
        count: item.count,
        circles: Array.from(item.circles),
        totalScore: item.totalScore,
        averageScore: item.count > 0 ? Math.round(item.totalScore / item.count) : 0,
        auditTypes: Array.from(item.auditTypes)
      }));

      console.log(`✅ Extracted ${auditorsFromAudits.length} unique auditors from audits:`, auditorsFromAudits);
      setAuditAuditors(auditorsFromAudits);
      
      // if (auditorsFromAudits.length > 0) {
      //   toast.success(`🎉 Found ${auditorsFromAudits.length} auditor${auditorsFromAudits.length > 1 ? 's' : ''} from uploaded audits!`);
      // }
    } catch (error: any) {
      console.error('❌ Error fetching auditors from audits:', error);
      toast.error('Failed to load auditors from audits');
    }
  };

  // Save auditors from audits to database with rate limiting
  const saveAuditorsToDatabase = async (auditorsFromAudits: AuditAuditor[]) => {
    try {
      console.log('💾 Saving auditors to database...');
      let newCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      // Batch processing with delay to avoid rate limiting
      const batchSize = 3; // Process 3 auditors at a time
      const delayMs = 1000; // 1 second delay between batches

      for (let i = 0; i < auditorsFromAudits.length; i += batchSize) {
        const batch = auditorsFromAudits.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (auditAuditor) => {
          try {
            // Check if auditor already exists in manual list
            const existingAuditor = auditors.find(
              a => a.name.toLowerCase().trim() === auditAuditor.name.toLowerCase().trim()
            );

            if (existingAuditor) {
              // Update existing auditor with new circles if any
              const existingCircles = existingAuditor.circles || [];
              const newCircles = auditAuditor.circles || [];
              const mergedCircles = Array.from(new Set([...existingCircles, ...newCircles]));

              // Only update if there are new circles
              if (mergedCircles.length > existingCircles.length) {
                await auditorService.updateAuditor(existingAuditor._id || existingAuditor.id, {
                  circles: mergedCircles
                });
                updatedCount++;
                console.log(`✏️ Updated auditor: ${auditAuditor.name} with new circles`);
              } else {
                skippedCount++;
              }
            } else {
              // Create new auditor
              const newAuditor: CreateAuditorData = {
                name: auditAuditor.name,
                email: `${auditAuditor.name.toLowerCase().replace(/\s+/g, '.')}@mercury-mystery.com`,
                phone: '',
                circles: auditAuditor.circles,
                status: 'active',
              };

              await auditorService.createAuditor(newAuditor);
              newCount++;
              console.log(`✅ Created new auditor: ${auditAuditor.name}`);
            }
          } catch (error: any) {
            console.error(`❌ Error processing auditor ${auditAuditor.name}:`, error);
            skippedCount++;
          }
        }));

        // Add delay between batches (except for the last batch)
        if (i + batchSize < auditorsFromAudits.length) {
          console.log(`⏳ Waiting ${delayMs}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      // Refresh auditors list and recalculate metrics
      await fetchAuditors();
      await calculateAuditorMetrics();

      if (newCount > 0 || updatedCount > 0 || skippedCount > 0) {
        const messages = [];
        if (newCount > 0) messages.push(`${newCount} created`);
        if (updatedCount > 0) messages.push(`${updatedCount} updated`);
        if (skippedCount > 0) messages.push(`${skippedCount} skipped`);
        toast.success(`💾 Sync complete: ${messages.join(', ')}!`);
        console.log(`✅ Database sync complete: ${newCount} created, ${updatedCount} updated, ${skippedCount} skipped`);
      } else {
        toast.info('ℹ️ All auditors are already up to date');
      }
    } catch (error: any) {
      console.error('❌ Error saving auditors to database:', error);
      toast.error('Failed to save auditors to database');
    }
  };

  // Initial load
  useEffect(() => {
    fetchAuditors();
    fetchAuditorsFromAudits();
    calculateAuditorMetrics();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAuditors(), fetchAuditorsFromAudits(), calculateAuditorMetrics()]);
    setRefreshing(false);
  };



  // Create auditor
  const handleSubmit = async (auditorData: Omit<Auditor, '_id' | 'createdAt' | 'updatedAt' | 'performanceMetrics' | 'status'>) => {
    try {
      const newAuditor: CreateAuditorData = {
        name: auditorData.name,
        email: auditorData.email,
        phone: auditorData.phone,
        circles: auditorData.circles,
        status: 'active',
      };

      if (editingAuditor) {
        // Update existing auditor
        await auditorService.updateAuditor(editingAuditor._id, newAuditor);
        toast.success('✅ Auditor updated successfully!');
      } else {
        // Create new auditor
        await auditorService.createAuditor(newAuditor);
        toast.success('✅ Auditor created successfully!');
      }

      setShowForm(false);
      setEditingAuditor(null);
      await fetchAuditors();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save auditor');
      console.error('Save auditor error:', error);
    }
  };

  // Delete auditor
  const handleDelete = async (auditorId: string, auditorName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${auditorName}?`)) {
      return;
    }

    try {
      await auditorService.deleteAuditor(auditorId);
      toast.success(`🗑️ ${auditorName} deleted successfully`);
      await fetchAuditors();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete auditor');
      console.error('Delete auditor error:', error);
    }
  };

  // Download template
  const downloadTemplate = (format: 'excel' | 'csv') => {
    if (format === 'excel') {
      const templateData = [
        ['Name', 'Email', 'Phone', 'Circles'],
        ['John Doe', 'john@example.com', '+91-9876543210', 'AP;BH;DEL'],
        ['Jane Smith', 'jane@example.com', '+91-9876543211', 'Mum;KK;PUN'],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Auditors');
      XLSX.writeFile(workbook, 'auditor_upload_template.xlsx');
      toast.success('📥 Excel template downloaded!');
    } else {
      const template = `Name,Email,Phone,Circles
John Doe,john@example.com,+91-9876543210,AP;BH;DEL
Jane Smith,jane@example.com,+91-9876543211,Mum;KK;PUN`;

      const blob = new Blob([template], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'auditor_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('📥 CSV template downloaded!');
    }
  };

  // Handle bulk upload
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    console.log('📁 File selected:', fileName, 'Is Excel:', isExcel);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setUploading(true);
        let auditorDataArray: CreateAuditorData[] = [];

        if (isExcel) {
          // Handle Excel files (.xls, .xlsx)
          console.log('📊 Parsing Excel file...');
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          console.log('📋 Raw Excel data:', jsonData);

          auditorDataArray = jsonData
            .slice(1) // Skip header
            .filter((row: any[]) => row && row.length > 0 && row.some(cell => cell)) // Skip empty rows
            .map((row: any[]) => {
              const [name, email, phone, circles] = row;
              return {
                name: name?.toString().trim() || '',
                email: email?.toString().trim() || '',
                phone: phone?.toString().trim() || '',
                circles: circles?.toString().split(';').map((c: string) => c.trim()).filter(Boolean) || [],
                status: 'active' as const,
              };
            })
            .filter(auditor => auditor.name && auditor.email); // Only valid auditors

          console.log('✅ Parsed auditors:', auditorDataArray);
        } else {
          // Handle CSV/TXT files
          console.log('📄 Parsing CSV file...');
          const text = event.target?.result as string;
          const lines = text.split('\n').slice(1); // Skip header

          auditorDataArray = lines
            .filter(line => line.trim())
            .map((line) => {
              const [name, email, phone, circles] = line.split(',');
              return {
                name: name?.trim() || '',
                email: email?.trim() || '',
                phone: phone?.trim() || '',
                circles: circles?.split(';').map(c => c.trim()).filter(Boolean) || [],
                status: 'active' as const,
              };
            })
            .filter(auditor => auditor.name && auditor.email); // Only valid auditors

          console.log('✅ Parsed auditors:', auditorDataArray);
        }

        // Check if we have data to upload
        if (auditorDataArray.length === 0) {
          toast.error('❌ No valid auditor data found in file. Please check the format.');
          console.error('No valid data extracted');
          return;
        }

        console.log(`🚀 Uploading ${auditorDataArray.length} auditors...`);

        // Upload all auditors
        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (const auditorData of auditorDataArray) {
          try {
            console.log('📤 Creating auditor:', auditorData);
            const result = await auditorService.createAuditor(auditorData);
            console.log('✅ Created:', result);
            results.push(result);
            successCount++;
          } catch (error: any) {
            console.error('❌ Failed to create auditor:', auditorData, error);
            failCount++;
          }
        }

        console.log(`✅ Upload complete: ${successCount} success, ${failCount} failed`);

        if (successCount > 0) {
          toast.success(`✅ ${successCount} auditor${successCount > 1 ? 's' : ''} uploaded successfully!`);
          setShowBulkUpload(false);
          await fetchAuditors();
        }

        if (failCount > 0) {
          toast.error(`❌ ${failCount} auditor${failCount > 1 ? 's' : ''} failed to upload`);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to upload auditors');
        console.error('Bulk upload error:', error);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = (error) => {
      console.error('❌ File read error:', error);
      toast.error('Failed to read file');
    };

    if (isExcel) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Edit auditor
  const handleEdit = (auditor: Auditor) => {
    setEditingAuditor(auditor);
    setShowForm(true);
  };

  // Check if auditor from audit already exists in manual list
  const isAuditorInManualList = (name: string) => {
    return auditors.some(a => a.name.toLowerCase() === name.toLowerCase());
  };

  // Get filtered auditors based on view mode
  const getFilteredAuditors = () => {
    return auditors;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#0AAE9A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg" style={{ color: '#6B7280' }}>Loading auditors...</p>
        </div>
      </div>
    );
  }

  const filteredAuditors = getFilteredAuditors();
  const uniqueAuditAuditors = auditAuditors.filter(a => !isAuditorInManualList(a.name));
  // Calculate total unique auditors
  const displayCount = auditors.length + uniqueAuditAuditors.length;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl shadow-lg" style={{ background: '#E0F7F4' }}>
            <Users className="w-8 h-8" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: '#111827', fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: '700', letterSpacing: '-0.03em' }}>Auditor Management</h2>
            <p className="m-0 text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>
              {displayCount} {displayCount === 1 ? 'auditor' : 'auditors'} total
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
            style={{ borderColor: '#0AAE9A', color: '#0AAE9A', backgroundColor: 'white', fontWeight: '600' }}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingAuditor(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-3 px-6 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #0AAE9A 0%, #078672 50%, #0AAE9A 100%)', backgroundSize: '200% 100%', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = '100% 0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = '0% 0'}
          >
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Create Auditor</span>
          </button>
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2"
            style={{ borderColor: '#0AAE9A', color: '#0AAE9A', backgroundColor: 'white', fontWeight: '600' }}
          >
            <Upload className="w-5 h-5" />
            <span>Bulk Upload</span>
          </button>
          
          <button
            onClick={async () => {
              if (auditAuditors.length === 0) {
                toast.info('ℹ️ No auditors found from audits. Upload some audits first!');
                return;
              }
              
              setRefreshing(true);
              try {
                await saveAuditorsToDatabase(auditAuditors);
              } catch (error) {
                console.error('Sync error:', error);
              }
              setRefreshing(false);
            }}
            disabled={refreshing || auditAuditors.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: '#3B82F6', color: '#3B82F6', backgroundColor: 'white', fontWeight: '600' }}
            title={auditAuditors.length === 0 ? 'Upload audits first to sync auditors' : 'Save auditors from audits to database'}
          >
            <Database className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : `Sync to DB (${auditAuditors.length})`}</span>
          </button>
        </div>
      </div>

      {/* Removed info banner - unified view */}

      {/* Removed view mode filter - unified view */}

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#E5E7EB]">
          <h3 className="mb-4" style={{ color: '#0AAE9A', fontSize: '1.25rem', fontWeight: '700' }}>Bulk Upload Auditors</h3>
          <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: '#0AAE9A', backgroundColor: '#E0F7F4' }}>
            {uploading ? (
              <div>
                <div className="inline-block w-16 h-16 border-4 border-[#0AAE9A] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="mb-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '1.1rem' }}>
                  Uploading auditors...
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Please wait while we process your file
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: '#0AAE9A' }} />
                <p className="mb-4" style={{ color: '#111827', fontWeight: '600', fontSize: '1.1rem' }}>Upload Excel or CSV file with auditor data</p>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  ✅ Native Excel support (.xls, .xlsx) - No conversion needed!
                </p>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  Format: Name, Email, Phone, Circles (semicolon separated)
                </p>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx,.txt"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bulk-upload-auditors"
                />
                <label
                  htmlFor="bulk-upload-auditors"
                  className="inline-block px-6 py-3 text-white rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)', fontWeight: '600' }}
                >
                  Choose File
                </label>

                <div className="mt-6 pt-6 border-t border-[#0AAE9A]/30">
                  <p className="text-sm mb-3" style={{ color: '#111827', fontWeight: '600' }}>
                    📥 Download Template:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => downloadTemplate('excel')}
                      className="px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105"
                      style={{ borderColor: '#0AAE9A', color: '#0AAE9A', backgroundColor: 'white', fontWeight: '500' }}
                    >
                      📊 Excel Template
                    </button>
                    <button
                      onClick={() => downloadTemplate('csv')}
                      className="px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105"
                      style={{ borderColor: '#0AAE9A', color: '#0AAE9A', backgroundColor: 'white', fontWeight: '500' }}
                    >
                      📄 CSV Template
                    </button>
                  </div>
                </div>
                
                <p className="text-xs mt-4" style={{ color: '#9CA3AF' }}>
                  💡 Tip: Download a template to see the correct format
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-10 animate-slideDown">
          <AuditorForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAuditor(null);
            }}
            initialData={editingAuditor || undefined}
          />
        </div>
      )}

      {/* Auditors Grid - Unified View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* All Auditors from Database */}
        {auditors.map((auditor, index) => (
          <div 
            key={auditor._id} 
            className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #E0F7F4 0%, white 100%)' }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#0AAE9A', filter: 'blur(40px)' }}></div>
            
            <div className="p-7 relative z-10">
              <div className="flex items-start mb-6">
                <div className="p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0" style={{ backgroundColor: '#E0F7F4' }}>
                  <UserPlus className="w-8 h-8" style={{ color: '#0AAE9A' }} />
                </div>

              </div>

              <div className="mb-6">
                <h3 className="mb-2" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
                  {auditor.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: auditor.status === 'active' ? 'rgba(10, 174, 154, 0.1)' : 'rgba(156, 163, 175, 0.1)', color: auditor.status === 'active' ? '#0AAE9A' : '#6B7280', fontWeight: '700' }}>
                    {(auditor.status || 'active').toUpperCase()}
                  </span>
                  {(() => {
                    const normalizedName = auditor.name.trim().toLowerCase().replace(/\s+/g, ' ');
                    const auditTypes = auditorMetrics[normalizedName]?.auditTypes || [];
                    return auditTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 rounded-lg text-xs"
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: '700' }}
                      >
                        {type}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0AAE9A' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>Email</p>
                    <p className="m-0 text-sm break-all" style={{ color: '#111827', fontWeight: '500' }}>{auditor.email}</p>
                  </div>
                </div>

                {auditor.phone && (
                  <div className="flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0AAE9A' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-1" style={{ color: '#6B7280', fontWeight: '600' }}>Phone</p>
                      <p className="m-0 text-sm" style={{ color: '#111827', fontWeight: '500' }}>{auditor.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0AAE9A' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Circles</p>
                    <div className="flex flex-wrap gap-2">
                      {auditor.circles.map((circle, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 rounded-lg text-xs transition-all hover:scale-105"
                          style={{ backgroundColor: '#E0F7F4', color: '#0AAE9A', fontWeight: '700', letterSpacing: '0.3px' }}
                        >
                          {circle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics - Calculated from Audits */}
                {(() => {
                  // Normalize name for lookup (case-insensitive, trim whitespace)
                  const normalizedName = auditor.name.trim().toLowerCase().replace(/\s+/g, ' ');
                  const metrics = auditorMetrics[normalizedName] || {
                    totalAssigned: 0,
                    totalCompleted: 0,
                    averageScore: 0,
                    totalScore: 0,
                    auditCount: 0,
                    auditTypes: []
                  };
                  
                  const getScoreColor = (score: number) => {
                    if (score >= 80) return '#22C55E'; // Green
                    if (score >= 60) return '#FBBF24'; // Yellow
                    if (score > 0) return '#EF4444'; // Red
                    return '#9CA3AF'; // Gray
                  };
                  
                  return (
                    <>
                      {/* Score Display - Always show */}
                      <div className="flex items-start gap-3 p-4 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                        <FileCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: getScoreColor(metrics.averageScore) }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Average Score</p>
                          {metrics.auditCount > 0 ? (
                            <>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full transition-all duration-500" 
                                      style={{ 
                                        width: `${metrics.averageScore}%`, 
                                        background: `linear-gradient(90deg, ${getScoreColor(metrics.averageScore)}, ${getScoreColor(metrics.averageScore)}dd)` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <span className="text-2xl" style={{ color: getScoreColor(metrics.averageScore), fontWeight: '700' }}>
                                  {metrics.averageScore}%
                                </span>
                              </div>
                              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                                Based on {metrics.auditCount} completed audit{metrics.auditCount > 1 ? 's' : ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm" style={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                              No completed audits yet
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Performance Stats */}
                      <div className="flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                        <FileCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0AAE9A' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Performance</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs" style={{ color: '#6B7280' }}>Assigned</p>
                              <p className="m-0 text-lg" style={{ color: '#0AAE9A', fontWeight: '700' }}>{metrics.totalAssigned}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: '#6B7280' }}>Completed</p>
                              <p className="m-0 text-lg" style={{ color: '#22C55E', fontWeight: '700' }}>{metrics.totalCompleted}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid rgba(229, 231, 235, 0.5)' }}>
                <p className="text-xs m-0" style={{ color: '#9CA3AF', fontWeight: '500' }}>
                  Created {new Date(auditor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Auditors from Audits (only unique ones not in database) */}
        {auditAuditors.map((auditor, index) => {
          // Skip auditors that already exist in database
          if (isAuditorInManualList(auditor.name)) return null;
          
          // Get score color based on average score
          const getScoreColor = (score: number) => {
            if (score >= 80) return '#22C55E'; // Green
            if (score >= 60) return '#FBBF24'; // Yellow
            return '#EF4444'; // Red
          };
          
          const scoreColor = getScoreColor(auditor.averageScore);
          
          return (
            <div 
              key={`audit-${auditor.name}`} 
              className="bg-white rounded-2xl shadow-lg border-2 hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group h-full"
              style={{ 
                borderColor: '#0AAE9A',
                animationDelay: `${(auditors.length + index) * 100}ms`
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ 
                background: 'linear-gradient(135deg, #E0F7F4 0%, white 100%)' 
              }}></div>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ 
                background: '#0AAE9A', 
                filter: 'blur(40px)' 
              }}></div>
              
              <div className="p-7 relative z-10">
                <div className="flex items-start mb-6">
                  <div className="p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0" style={{ 
                    backgroundColor: '#E0F7F4'
                  }}>
                    <Database className="w-8 h-8" style={{ color: '#0AAE9A' }} />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
                    {auditor.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs" style={{ 
                      backgroundColor: 'rgba(10, 174, 154, 0.1)', 
                      color: '#0AAE9A', 
                      fontWeight: '700' 
                    }}>
                      {auditor.count} AUDIT{auditor.count > 1 ? 'S' : ''}
                    </span>
                    {auditor.auditTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 rounded-lg text-xs"
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: '700' }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Average Score Display */}
                  <div className="flex items-start gap-3 p-4 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                    <FileCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: scoreColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Average Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-500" 
                              style={{ 
                                width: `${auditor.averageScore}%`, 
                                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}dd)` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-2xl" style={{ color: scoreColor, fontWeight: '700' }}>
                          {auditor.averageScore}%
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        Total: {auditor.totalScore} points across {auditor.count} audit{auditor.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0AAE9A' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Circles</p>
                      <div className="flex flex-wrap gap-2">
                        {auditor.circles.length > 0 ? (
                          auditor.circles.map((circle, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-3 py-1 rounded-lg text-xs transition-all hover:scale-105"
                              style={{ backgroundColor: '#E0F7F4', color: '#0AAE9A', fontWeight: '700', letterSpacing: '0.3px' }}
                            >
                              {circle}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>No circles specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {auditors.length === 0 && auditAuditors.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl shadow-lg p-16 text-center border border-[#E5E7EB]">
            <div className="inline-flex p-6 rounded-3xl mb-6 shadow-lg" style={{ background: '#E0F7F4' }}>
              <Users className="w-16 h-16" style={{ color: '#0AAE9A' }} />
            </div>
            <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>
              No Auditors Yet
            </h4>
            <p className="m-0" style={{ color: '#6B7280', fontWeight: '500' }}>
              Create auditor accounts or upload audits to get started!
            </p>
          </div>
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
