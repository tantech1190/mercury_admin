import { useState, useEffect, useMemo } from 'react';
import { Users, ClipboardList, LogOut, Home, Brain, ClipboardCheck, BarChart3, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';
import { AuditorManagement } from './AuditorManagement';
import { AssignmentManagement } from './AssignmentManagement';
import { AuditManagement } from './AuditManagement';
import { ReportsView } from './ReportsView';
import { AuditorLocation } from './AuditorLocation';
import { AIAuditAnalysis } from './AIAuditAnalysis';
import { DashboardHome } from './DashboardHome'; // Dashboard Home Component
import { AuditDatabaseDebugger } from './AuditDatabaseDebugger';
import { MongoIndexChecker } from './MongoIndexChecker';
import { Auditor, Assignment, Audit } from '../types';
import auditService from '../services/audit.service';
import auditorService from '../services/auditor.service';
import assignmentService from '../services/assignment.service';

type Tab = 'home' | 'auditors' | 'audits' | 'assignments' | 'reports' | 'locations' | 'aiAnalysis';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { user, logout } = useAuth();
  
  // Initialize state with empty arrays to prevent undefined errors
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [loadingAuditors, setLoadingAuditors] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Load auditors from API
  const loadAuditors = async () => {
    try {
      setLoadingAuditors(true);
      const auditorsData = await auditorService.getAllAuditors();
      console.log('📊 Loaded auditors from DB:', auditorsData);
      console.log('📊 Number of auditors:', auditorsData?.length || 0);
      setAuditors(auditorsData || []);
    } catch (error: any) {
      console.error('Error loading auditors:', error);
      toast.error(error.message || 'Failed to load auditors');
      setAuditors([]); // Ensure we set empty array on error
    } finally {
      setLoadingAuditors(false);
    }
  };

  // Load audits from API
  const loadAudits = async () => {
    try {
      setLoadingAudits(true);
      console.log('📊 Loading audits from API...');
      const response = await auditService.getAllAudits();
      console.log('✅ Audits loaded:', response);
      console.log('📝 Number of audits:', response.audits?.length || 0);
      setAudits(response.audits || []);
      
      if (response.audits && response.audits.length > 0) {
        console.log('🎉 Successfully set', response.audits.length, 'audits to state');
      } else {
        console.warn('⚠️ No audits returned from API');
      }
    } catch (error: any) {
      console.error('❌ Failed to load audits:', error);
      toast.error('Failed to load audits: ' + (error.message || 'Unknown error'));
    } finally {
      setLoadingAudits(false);
    }
  };

  // Load assignments from API
  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      console.log('📋 Loading assignments from API...');
      const assignmentsData = await assignmentService.getAllAssignments();
      console.log('✅ Assignments loaded:', assignmentsData);
      setAssignments(assignmentsData || []);
    } catch (error: any) {
      console.error('❌ Failed to load assignments:', error);
      toast.error(error.message || 'Failed to load assignments');
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Load audits, auditors, and assignments from API on mount
  useEffect(() => {
    loadAudits();
    loadAuditors();
    loadAssignments();
  }, []);

  // Reload data when switching tabs
  useEffect(() => {
    if (activeTab === 'home') {
      loadAuditors();
      loadAudits(); // Refresh audits for home dashboard
    } else if (activeTab === 'audits') {
      loadAudits(); // Refresh audits when switching to audits tab
    }
  }, [activeTab]);

  const handleAddAudit = async (auditData: Omit<Audit, '_id' | 'createdAt'>) => {
    try {
      await auditService.createAudit(auditData as any);
      toast.success('✅ Audit created successfully!');
      loadAudits(); // Reload audits
    } catch (error: any) {
      toast.error(error.message || 'Failed to create audit');
      throw error;
    }
  };

  const handleUpdateAudit = async (auditId: string, updates: Partial<Audit>) => {
    try {
      await auditService.updateAudit(auditId, updates as any);
      toast.success('✅ Audit updated successfully!');
      loadAudits(); // Reload audits
    } catch (error: any) {
      toast.error(error.message || 'Failed to update audit');
      throw error;
    }
  };

  const handleAssignAudit = async (auditId: string, auditorId: string) => {
    try {
      await auditService.updateAudit(auditId, { auditorId } as any);
      toast.success('✅ Audit assigned successfully!');
      loadAudits(); // Reload audits
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign audit');
      throw error;
    }
  };

  const handleAddAssignment = async (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    try {
      await assignmentService.createAssignment({
        title: assignment.title,
        description: assignment.description,
        auditorId: assignment.auditorId,
        auditorName: assignment.auditorName,
        deadline: assignment.deadline,
        status: assignment.status,
      });
      toast.success('✅ Assignment created successfully!');
      loadAssignments(); // Reload assignments
    } catch (error: any) {
      toast.error(error.message || 'Failed to create assignment');
      throw error;
    }
  };

  const handleUpdateAssignment = async (id: string, status: Assignment['status']) => {
    try {
      await assignmentService.updateAssignment(id, { status });
      toast.success('✅ Assignment status updated!');
      loadAssignments(); // Reload assignments
    } catch (error: any) {
      toast.error(error.message || 'Failed to update assignment');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('👋 Logged out successfully. See you next time!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  // Calculate total unique auditors (from database + from uploaded audits)
  const allAuditors = useMemo(() => {
    console.log('🔍 Calculating total auditors...');
    console.log('📊 Auditors from DB:', auditors.length);
    console.log('📋 Total audits:', audits.length);
    
    // Extract unique auditor names from audits
    const auditorNamesFromAudits = new Set<string>();
    
    audits.forEach(audit => {
      // Try to get auditor name - check rawData first for all audit types
      let auditorName = audit.auditorName;
      
      // If not found at top level, check rawData (comprehensive check)
      if (!auditorName && audit.rawData) {
        auditorName = audit.rawData['Name of Auditor'] || 
                     audit.rawData['Name of auditor'] || 
                     audit.rawData['Auditor Name'] ||
                     audit.rawData['Name of the CRO/Executive'] || 
                     audit.rawData.auditor || 
                     audit.rawData.auditorName || '';
      }
      
      // For XFE audits only, storeName might contain auditor name (as fallback)
      // Note: For ILMS, storeName is the ambassador, not the auditor!
      if (!auditorName && audit.auditType?.toLowerCase() === 'xfe') {
        auditorName = audit.storeName;
      }
      
      if (auditorName && typeof auditorName === 'string' && auditorName.trim()) {
        // Normalize: trim, lowercase, and normalize whitespace
        const normalizedName = auditorName.trim().toLowerCase().replace(/\s+/g, ' ');
        auditorNamesFromAudits.add(normalizedName);
      }
    });

    console.log('👥 Unique auditors from audits:', auditorNamesFromAudits.size);
    console.log('📝 Auditor names from audits:', Array.from(auditorNamesFromAudits));

    // Get existing auditor names from database (also normalized)
    const existingAuditorNames = new Set(
      auditors.map(a => a.name.trim().toLowerCase().replace(/\s+/g, ' '))
    );

    console.log('💾 Auditor names from DB:', Array.from(existingAuditorNames));

    // Combine both sets to get unique auditor names
    const allUniqueNames = new Set([...existingAuditorNames, ...auditorNamesFromAudits]);

    console.log('✅ Total unique auditors:', allUniqueNames.size);

    // Return the database auditors for display, but we'll pass the total count separately
    return {
      displayAuditors: auditors,
      totalCount: allUniqueNames.size
    };
  }, [auditors, audits]);

  return (
    <div className="min-h-screen relative" style={{ background: '#F5F7FA' }}>
      {/* Premium Header */}
      <header className="text-white relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)]" style={{ background: '#20252B' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl backdrop-blur-sm shadow-lg border" style={{ backgroundColor: '#0AAE9A', borderColor: 'rgba(255,255,255,0.1)' }}>
              <ClipboardList className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-white mb-0.5 drop-shadow-md" style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
              <p className="text-white/80 text-xs m-0" style={{ fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {user?.name ? `Welcome, ${user.name}` : 'Mercury Mystery Audit System'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-md shadow-lg border group"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255,255,255,0.2)', fontWeight: '600' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            Logout
          </button>
        </div>
      </header>

      {/* Premium Navigation */}
      <nav className="bg-white backdrop-blur-lg sticky top-0 z-50 shadow-sm overflow-x-auto" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-0 sm:gap-1 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'home' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'home' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Home</span>
              {activeTab === 'home' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('auditors')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'auditors' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'auditors' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Auditors</span>
              {activeTab === 'auditors' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'audits' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'audits' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Audits</span>
              {activeTab === 'audits' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'assignments' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'assignments' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Assignments</span>
              {activeTab === 'assignments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'reports' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'reports' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Reports</span>
              {activeTab === 'reports' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'locations' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'locations' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">Locations</span>
              {activeTab === 'locations' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('aiAnalysis')}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 transition-all duration-300 relative group whitespace-nowrap"
              style={{
                color: activeTab === 'aiAnalysis' ? '#0AAE9A' : '#6B7280',
                fontWeight: activeTab === 'aiAnalysis' ? '600' : '500',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)'
              }}
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="text-xs sm:text-base">AI Analysis</span>
              {activeTab === 'aiAnalysis' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full" style={{ background: '#0AAE9A' }}></div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {activeTab === 'home' && (
          <DashboardHome 
            auditors={allAuditors.displayAuditors} 
            assignments={assignments} 
            audits={audits}
            totalAuditorsCount={allAuditors.totalCount}
          />
        )}
        {activeTab === 'auditors' && <AuditorManagement />}
        {activeTab === 'audits' && (
          <AuditManagement 
            audits={audits}
            auditors={auditors}
            onAddAudit={handleAddAudit}
            onBulkAddAudits={loadAudits}
            onAssignAudit={handleAssignAudit}
            onUpdateAudit={handleUpdateAudit}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentManagement 
            auditors={auditors}
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsView 
            audits={audits} 
            auditors={auditors} 
          />
        )}
        {activeTab === 'locations' && (
          <AuditorLocation 
            auditors={auditors} 
          />
        )}
        {activeTab === 'aiAnalysis' && (
          <AIAuditAnalysis 
            audits={audits} 
            auditors={auditors} 
          />
        )}
      </main>

      {/* Database Debugger - Bottom Right Corner */}
      <AuditDatabaseDebugger />
    </div>
  );
}