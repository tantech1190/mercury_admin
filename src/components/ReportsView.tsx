import { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, Target, Clock, Award, AlertTriangle, 
  CheckCircle, XCircle, Filter, Download, RefreshCw, Users, MapPin, Phone, Building2,
  Star, AlertCircle, Activity, Zap, Trophy, FileText, ChevronDown, ChevronRight, X,
  TrendingDown as TrendDown, Store, MapPinned, User, ChevronUp
} from 'lucide-react';
import { Audit, Auditor } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart 
} from 'recharts';

interface ReportsViewProps {
  audits: Audit[];
  auditors: Auditor[];
}

type AuditType = 'store' | 'xfe' | 'ilms';
type TimeFilter = 'all' | 'this-month' | 'last-month' | 'this-year';
type TrendView = 'month' | 'year' | 'circle' | 'zbm' | 'tsm' | 'store' | 'pincode' | 'executive';

export function ReportsView({ audits, auditors }: ReportsViewProps) {
  const [activeAuditType, setActiveAuditType] = useState<AuditType>('store');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    month: 'all',
    year: 'all',
    circle: 'all',
    zbm: 'all',
    tsm: 'all',
    storeName: 'all',
    croName: 'all',
    pincode: 'all',
    xfeName: 'all',
    ambassadorName: 'all',
    auditDate: 'all',
    dropReason: 'all',
  });
  const [expandedParameter, setExpandedParameter] = useState<string | null>(null);
  const [trendView, setTrendView] = useState<TrendView>('month');

  // Filter audits by active type and time
  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      if (audit.auditType !== activeAuditType) return false;
      
      // Apply time filter
      if (timeFilter !== 'all' && audit.createdAt) {
        const auditDate = new Date(audit.createdAt);
        const now = new Date();
        
        if (timeFilter === 'this-month') {
          if (auditDate.getMonth() !== now.getMonth() || auditDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (timeFilter === 'last-month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          if (auditDate.getMonth() !== lastMonth.getMonth() || auditDate.getFullYear() !== lastMonth.getFullYear()) {
            return false;
          }
        } else if (timeFilter === 'this-year') {
          if (auditDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }
      
      // Apply other filters
      if (selectedFilters.month !== 'all' && audit.month !== selectedFilters.month) return false;
      if (selectedFilters.year !== 'all' && audit.year?.toString() !== selectedFilters.year) return false;
      if (selectedFilters.circle !== 'all' && audit.circle !== selectedFilters.circle) return false;
      if (selectedFilters.zbm !== 'all' && audit.zbm !== selectedFilters.zbm) return false;
      if (selectedFilters.tsm !== 'all' && audit.tsm !== selectedFilters.tsm) return false;
      if (selectedFilters.storeName !== 'all' && audit.storeName !== selectedFilters.storeName) return false;
      if (selectedFilters.pincode !== 'all' && audit.pincode !== selectedFilters.pincode) return false;
      
      return true;
    });
  }, [audits, activeAuditType, timeFilter, selectedFilters]);

  // Get unique values for filters
  const getUniqueValues = (key: keyof Audit) => {
    const typeAudits = audits.filter(a => a.auditType === activeAuditType);
    const values = [...new Set(typeAudits.map(a => a[key]).filter(Boolean))];
    return values.sort();
  };

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const total = filteredAudits.length;
    const completed = filteredAudits.filter(a => a.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : '0';
    const pendingRate = total > 0 ? (pending / total * 100).toFixed(1) : '0';
    
    // Drop reasons breakdown
    const unassignedAuditor = filteredAudits.filter(a => a.status === 'unassigned').length;
    const executiveNotAvailable = filteredAudits.filter(a => a.status === 'at-risk').length;
    const noCallReceived = activeAuditType === 'ilms' ? filteredAudits.filter(a => a.dropReason === 'no-call-received').length : 0;
    const noExecutiveAssigned = activeAuditType === 'ilms' ? filteredAudits.filter(a => a.dropReason === 'no-executive').length : 0;
    const otherReasons = filteredAudits.filter(a => a.dropReason === 'other').length;
    
    // TAT Compliance (24-48 hours)
    const auditsWithTAT = filteredAudits.filter(a => {
      if (a.status !== 'completed' || !a.completedAt || !a.createdAt) return false;
      const hoursDiff = (new Date(a.completedAt).getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 48;
    });
    const tatCompliance = completed > 0 ? (auditsWithTAT.length / completed * 100).toFixed(1) : '0';
    const tatNonCompliance = completed - auditsWithTAT.length;
    const tatNonComplianceRate = completed > 0 ? (tatNonCompliance / completed * 100).toFixed(1) : '0';
    
    // QC Status
    const qcDone = filteredAudits.filter(a => a.qcStatus === 'done').length;
    const qcPending = filteredAudits.filter(a => a.qcStatus === 'pending' || (a.status === 'completed' && !a.qcStatus)).length;
    const qcRate = completed > 0 ? (qcDone / completed * 100).toFixed(1) : '0';
    const qcPendingRate = completed > 0 ? (qcPending / completed * 100).toFixed(1) : '0';
    
    // Score metrics - Overall
    const auditsWithScores = filteredAudits.filter(a => a.score !== undefined && a.score !== null);
    const avgOverallScore = auditsWithScores.length > 0 
      ? (auditsWithScores.reduce((sum, a) => sum + (a.score || 0), 0) / auditsWithScores.length).toFixed(1)
      : '0';
    
    // Average Without Fatal Score (only non-fatal audits)
    const nonFatalAuditsForAvg = auditsWithScores.filter(a => (a.score || 0) >= 70);
    const avgWithoutFatalScore = nonFatalAuditsForAvg.length > 0 
      ? (nonFatalAuditsForAvg.reduce((sum, a) => sum + (a.score || 0), 0) / nonFatalAuditsForAvg.length).toFixed(1)
      : '0';
    
    // Customer Experience Rating (mock - would come from audit data)
    const auditsWithCXRating = filteredAudits.filter(a => a.customerExperienceRating);
    const avgCXRating = auditsWithCXRating.length > 0 
      ? (auditsWithCXRating.reduce((sum, a) => sum + (a.customerExperienceRating || 0), 0) / auditsWithCXRating.length).toFixed(1)
      : '0';
    
    // Fatal audits (score < 70)
    const fatalAudits = auditsWithScores.filter(a => (a.score || 0) < 70).length;
    const nonFatalAudits = auditsWithScores.length - fatalAudits;
    const fatalRate = auditsWithScores.length > 0 ? (fatalAudits / auditsWithScores.length * 100).toFixed(1) : '0';
    const nonFatalRate = auditsWithScores.length > 0 ? (nonFatalAudits / auditsWithScores.length * 100).toFixed(1) : '0';
    
    // Highest and Lowest scores
    const scores = auditsWithScores.map(a => a.score || 0);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    
    return {
      total,
      completed,
      pending,
      completionRate,
      pendingRate,
      unassignedAuditor,
      executiveNotAvailable,
      noCallReceived,
      noExecutiveAssigned,
      otherReasons,
      tatCompliance,
      tatCount: auditsWithTAT.length,
      tatNonCompliance,
      tatNonComplianceRate,
      qcDone,
      qcPending,
      qcRate,
      qcPendingRate,
      avgOverallScore,
      avgWithoutFatalScore,
      avgCXRating,
      fatalAudits,
      nonFatalAudits,
      fatalRate,
      nonFatalRate,
      highestScore,
      lowestScore,
      auditsWithScores: auditsWithScores.length
    };
  }, [filteredAudits, activeAuditType]);

  // Dynamic Trend Analysis based on selected view
  const trendData = useMemo(() => {
    if (trendView === 'month') {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months.map(month => {
        const monthAudits = filteredAudits.filter(a => a.month === month && a.score);
        const avgScore = monthAudits.length > 0 
          ? monthAudits.reduce((sum, a) => sum + (a.score || 0), 0) / monthAudits.length
          : 0;
        return {
          name: month.substring(0, 3),
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: monthAudits.length
        };
      }).filter(m => m.count > 0);
    } else if (trendView === 'year') {
      const years = [...new Set(filteredAudits.map(a => a.year).filter(Boolean))].sort();
      return years.map(year => {
        const yearAudits = filteredAudits.filter(a => a.year === year && a.score);
        const avgScore = yearAudits.length > 0 
          ? yearAudits.reduce((sum, a) => sum + (a.score || 0), 0) / yearAudits.length
          : 0;
        return {
          name: year?.toString() || '',
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: yearAudits.length
        };
      }).filter(y => y.count > 0);
    } else if (trendView === 'circle') {
      const circles = ['AP', 'BH', 'DEL', 'Guj', 'HR', 'JK', 'KER', 'KK', 'MPCG', 'Mum', 'NESA', 'OR', 'PB', 'RAJ', 'ROM', 'TN', 'UPE', 'UPW', 'WB'];
      return circles.map(circle => {
        const circleAudits = filteredAudits.filter(a => a.circle === circle && a.score);
        const avgScore = circleAudits.length > 0 
          ? circleAudits.reduce((sum, a) => sum + (a.score || 0), 0) / circleAudits.length
          : 0;
        return {
          name: circle,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: circleAudits.length
        };
      }).filter(c => c.count > 0).sort((a, b) => b.avgScore - a.avgScore);
    } else if (trendView === 'zbm' && activeAuditType === 'store') {
      const zbms = [...new Set(filteredAudits.map(a => a.zbm).filter(Boolean))];
      return zbms.map(zbm => {
        const zbmAudits = filteredAudits.filter(a => a.zbm === zbm && a.score);
        const avgScore = zbmAudits.length > 0 
          ? zbmAudits.reduce((sum, a) => sum + (a.score || 0), 0) / zbmAudits.length
          : 0;
        return {
          name: zbm as string,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: zbmAudits.length
        };
      }).filter(z => z.count > 0).sort((a, b) => b.avgScore - a.avgScore);
    } else if (trendView === 'tsm' && activeAuditType === 'store') {
      const tsms = [...new Set(filteredAudits.map(a => a.tsm).filter(Boolean))];
      return tsms.map(tsm => {
        const tsmAudits = filteredAudits.filter(a => a.tsm === tsm && a.score);
        const avgScore = tsmAudits.length > 0 
          ? tsmAudits.reduce((sum, a) => sum + (a.score || 0), 0) / tsmAudits.length
          : 0;
        return {
          name: tsm as string,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: tsmAudits.length
        };
      }).filter(t => t.count > 0).sort((a, b) => b.avgScore - a.avgScore);
    } else if (trendView === 'store') {
      const stores = [...new Set(filteredAudits.map(a => a.storeName).filter(Boolean))];
      return stores.map(store => {
        const storeAudits = filteredAudits.filter(a => a.storeName === store && a.score);
        const avgScore = storeAudits.length > 0 
          ? storeAudits.reduce((sum, a) => sum + (a.score || 0), 0) / storeAudits.length
          : 0;
        return {
          name: store as string,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: storeAudits.length
        };
      }).filter(s => s.count > 0).sort((a, b) => b.avgScore - a.avgScore).slice(0, 20);
    } else if (trendView === 'pincode') {
      const pincodes = [...new Set(filteredAudits.map(a => a.pincode).filter(Boolean))];
      return pincodes.map(pincode => {
        const pincodeAudits = filteredAudits.filter(a => a.pincode === pincode && a.score);
        const avgScore = pincodeAudits.length > 0 
          ? pincodeAudits.reduce((sum, a) => sum + (a.score || 0), 0) / pincodeAudits.length
          : 0;
        return {
          name: pincode as string,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: pincodeAudits.length
        };
      }).filter(p => p.count > 0).sort((a, b) => b.avgScore - a.avgScore).slice(0, 20);
    } else if (trendView === 'executive') {
      const executives = [...new Set(filteredAudits.map(a => a.executiveName || a.croName || a.xfeName || a.ambassadorName).filter(Boolean))];
      return executives.map(exec => {
        const execAudits = filteredAudits.filter(a => 
          (a.executiveName === exec || a.croName === exec || a.xfeName === exec || a.ambassadorName === exec) && a.score
        );
        const avgScore = execAudits.length > 0 
          ? execAudits.reduce((sum, a) => sum + (a.score || 0), 0) / execAudits.length
          : 0;
        return {
          name: exec as string,
          avgScore: parseFloat(avgScore.toFixed(1)),
          count: execAudits.length
        };
      }).filter(e => e.count > 0).sort((a, b) => b.avgScore - a.avgScore).slice(0, 20);
    }
    return [];
  }, [filteredAudits, trendView, activeAuditType]);

  // Main Parameter Performance with Sub-Parameters (mock data - would come from actual audit details)
  const mainParameterPerformance = [
    { 
      parameter: 'Store Ambiance & Branding', 
      avgScore: 92.5, 
      color: '#22C55E',
      subParameters: [
        { name: 'Cleanliness & Hygiene', avgScore: 95.2 },
        { name: 'Branding Display', avgScore: 91.8 },
        { name: 'Lighting & Ambiance', avgScore: 90.5 },
      ]
    },
    { 
      parameter: 'Customer Service & Engagement', 
      avgScore: 85.3, 
      color: '#22C55E',
      subParameters: [
        { name: 'Greeting & Welcome', avgScore: 92.1 },
        { name: 'Active Listening', avgScore: 85.7 },
        { name: 'Rapport Building', avgScore: 78.2 },
      ]
    },
    { 
      parameter: 'Process Compliance', 
      avgScore: 76.8, 
      color: '#FBBF24',
      subParameters: [
        { name: 'Documentation Accuracy', avgScore: 81.5 },
        { name: 'SOP Adherence', avgScore: 75.2 },
        { name: 'System Entry Timeliness', avgScore: 73.7 },
      ]
    },
    { 
      parameter: 'Product Knowledge', 
      avgScore: 68.3, 
      color: '#EF4444',
      subParameters: [
        { name: 'Plan Knowledge', avgScore: 72.8 },
        { name: 'Device Knowledge', avgScore: 68.5 },
        { name: 'Competitive Knowledge', avgScore: 63.6 },
      ]
    },
    { 
      parameter: 'Probing & Pitching', 
      avgScore: 62.5, 
      color: '#EF4444',
      subParameters: [
        { name: 'Need Identification', avgScore: 68.2 },
        { name: 'Solution Presentation', avgScore: 61.5 },
        { name: 'Upselling Attempt', avgScore: 57.8 },
      ]
    }
  ].sort((a, b) => b.avgScore - a.avgScore);

  // Top 5 Fatal Reasons (mock - would come from actual audit data)
  const top5FatalReasons = [
    { mainParameter: 'Probing & Pitching', subParameter: 'No Upselling Attempt', count: 45, percentage: 22.5 },
    { mainParameter: 'Product Knowledge', subParameter: 'Incorrect Plan Information', count: 38, percentage: 19.0 },
    { mainParameter: 'Process Compliance', subParameter: 'Documentation Not Completed', count: 32, percentage: 16.0 },
    { mainParameter: 'Customer Service', subParameter: 'Poor Customer Handling', count: 28, percentage: 14.0 },
    { mainParameter: 'Process Compliance', subParameter: 'SOP Violation', count: 24, percentage: 12.0 }
  ];

  // Top 5 Low Score Reasons
  const top5LowScoreReasons = [
    { reason: 'Inadequate Product Training', impact: 'High', affectedAudits: 67 },
    { reason: 'Lack of Customer Engagement Skills', impact: 'High', affectedAudits: 54 },
    { reason: 'Process Documentation Gaps', impact: 'Medium', affectedAudits: 48 },
    { reason: 'Insufficient System Knowledge', impact: 'Medium', affectedAudits: 42 },
    { reason: 'Time Management Issues', impact: 'Low', affectedAudits: 35 }
  ];

  // Top 5 Areas of Improvement
  const top5ImprovementAreas = [
    { area: 'Probing & Pitching Skills', currentScore: 62.5, targetScore: 85, gap: 22.5, priority: 'Critical' },
    { area: 'Product Knowledge Enhancement', currentScore: 68.3, targetScore: 85, gap: 16.7, priority: 'High' },
    { area: 'Process Compliance Training', currentScore: 76.8, targetScore: 90, gap: 13.2, priority: 'High' },
    { area: 'Customer Engagement', currentScore: 78.2, targetScore: 90, gap: 11.8, priority: 'Medium' },
    { area: 'Documentation Accuracy', currentScore: 81.5, targetScore: 92, gap: 10.5, priority: 'Medium' }
  ];

  // Render filter fields based on audit type
  const renderFilters = () => {
    const commonFilters = (
      <>
        <div>
          <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Time Period</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
          >
            <option value="all">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Month</label>
          <select
            value={selectedFilters.month}
            onChange={(e) => setSelectedFilters({...selectedFilters, month: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
          >
            <option value="all">All Months</option>
            {getUniqueValues('month').map(month => (
              <option key={month as string} value={month as string}>{month as string}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Year</label>
          <select
            value={selectedFilters.year}
            onChange={(e) => setSelectedFilters({...selectedFilters, year: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
          >
            <option value="all">All Years</option>
            {getUniqueValues('year').map(year => (
              <option key={year as string} value={year as string}>{year as string}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Circle</label>
          <select
            value={selectedFilters.circle}
            onChange={(e) => setSelectedFilters({...selectedFilters, circle: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
            style={{ fontSize: '0.875rem', fontWeight: '600' }}
          >
            <option value="all">All Circles</option>
            {getUniqueValues('circle').map(circle => (
              <option key={circle as string} value={circle as string}>{circle as string}</option>
            ))}
          </select>
        </div>
      </>
    );

    if (activeAuditType === 'store') {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>ZBM</label>
            <select
              value={selectedFilters.zbm}
              onChange={(e) => setSelectedFilters({...selectedFilters, zbm: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All ZBMs</option>
              {getUniqueValues('zbm').map(zbm => (
                <option key={zbm as string} value={zbm as string}>{zbm as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>TSM</label>
            <select
              value={selectedFilters.tsm}
              onChange={(e) => setSelectedFilters({...selectedFilters, tsm: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All TSMs</option>
              {getUniqueValues('tsm').map(tsm => (
                <option key={tsm as string} value={tsm as string}>{tsm as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Store Name</label>
            <select
              value={selectedFilters.storeName}
              onChange={(e) => setSelectedFilters({...selectedFilters, storeName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All Stores</option>
              {getUniqueValues('storeName').map(store => (
                <option key={store as string} value={store as string}>{store as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>CRO/Executive</label>
            <select
              value={selectedFilters.croName}
              onChange={(e) => setSelectedFilters({...selectedFilters, croName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All CRO/Executives</option>
              {getUniqueValues('croName').map(cro => (
                <option key={cro as string} value={cro as string}>{cro as string}</option>
              ))}
            </select>
          </div>
        </>
      );
    } else if (activeAuditType === 'xfe') {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Pincode</label>
            <select
              value={selectedFilters.pincode}
              onChange={(e) => setSelectedFilters({...selectedFilters, pincode: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All Pincodes</option>
              {getUniqueValues('pincode').map(pin => (
                <option key={pin as string} value={pin as string}>{pin as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Airtel XFE Name</label>
            <select
              value={selectedFilters.xfeName}
              onChange={(e) => setSelectedFilters({...selectedFilters, xfeName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All XFE</option>
              {getUniqueValues('xfeName').map(xfe => (
                <option key={xfe as string} value={xfe as string}>{xfe as string}</option>
              ))}
            </select>
          </div>
        </>
      );
    } else if (activeAuditType === 'ilms') {
      return (
        <>
          {commonFilters}
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Pincode</label>
            <select
              value={selectedFilters.pincode}
              onChange={(e) => setSelectedFilters({...selectedFilters, pincode: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All Pincodes</option>
              {getUniqueValues('pincode').map(pin => (
                <option key={pin as string} value={pin as string}>{pin as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>Ambassador Name</label>
            <select
              value={selectedFilters.ambassadorName}
              onChange={(e) => setSelectedFilters({...selectedFilters, ambassadorName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
              style={{ fontSize: '0.875rem', fontWeight: '600' }}
            >
              <option value="all">All Ambassadors</option>
              {getUniqueValues('ambassadorName').map(amb => (
                <option key={amb as string} value={amb as string}>{amb as string}</option>
              ))}
            </select>
          </div>
        </>
      );
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 lg:p-4 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)' }}>
              <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h1 className="m-0" style={{ color: '#111827', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
                Reports & Data Analytics
              </h1>
              <p className="m-0 mt-1 text-sm lg:text-base" style={{ color: '#6B7280', fontWeight: '500' }}>
                Interactive Dashboard - Mystery Audit Performance Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            
            <button className="px-3 py-2 lg:px-5 lg:py-3 rounded-xl flex items-center gap-2" style={{ background: '#E0F7F4', color: '#0AAE9A', fontWeight: '700' }}>
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">Refresh</span>
            </button>
          </div>
        </div>

        {/* Audit Type Tabs - Top Headers */}
        <div className="flex gap-3 lg:gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveAuditType('store')}
            className="flex-1 min-w-[280px] p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300"
            style={{
              background: activeAuditType === 'store' ? 'linear-gradient(135deg, #2563EB, #1e40af)' : 'white',
              borderColor: activeAuditType === 'store' ? '#2563EB' : '#E5E7EB',
              boxShadow: activeAuditType === 'store' ? '0 10px 40px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Building2 className="w-8 h-8" style={{ color: activeAuditType === 'store' ? 'white' : '#2563EB' }} />
              <span 
                className="px-4 py-2 rounded-lg text-sm"
                style={{ 
                  background: activeAuditType === 'store' ? 'rgba(255,255,255,0.2)' : 'rgba(37, 99, 235, 0.1)',
                  color: activeAuditType === 'store' ? 'white' : '#2563EB',
                  fontWeight: '700'
                }}
              >
                {audits.filter(a => a.auditType === 'store').length}
              </span>
            </div>
            <h3 
              className="m-0 mb-1" 
              style={{ 
                color: activeAuditType === 'store' ? 'white' : '#111827', 
                fontSize: '1.5rem', 
                fontWeight: '800' 
              }}
            >
              STORE AUDITS
            </h3>
            
          </button>

          <button
            onClick={() => setActiveAuditType('xfe')}
            className="flex-1 min-w-[280px] p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300"
            style={{
              background: activeAuditType === 'xfe' ? 'linear-gradient(135deg, #F97316, #ea580c)' : 'white',
              borderColor: activeAuditType === 'xfe' ? '#F97316' : '#E5E7EB',
              boxShadow: activeAuditType === 'xfe' ? '0 10px 40px rgba(249, 115, 22, 0.3)' : 'none'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Phone className="w-8 h-8" style={{ color: activeAuditType === 'xfe' ? 'white' : '#F97316' }} />
              <span 
                className="px-4 py-2 rounded-lg text-sm"
                style={{ 
                  background: activeAuditType === 'xfe' ? 'rgba(255,255,255,0.2)' : 'rgba(249, 115, 22, 0.1)',
                  color: activeAuditType === 'xfe' ? 'white' : '#F97316',
                  fontWeight: '700'
                }}
              >
                {audits.filter(a => a.auditType === 'xfe').length}
              </span>
            </div>
            <h3 
              className="m-0 mb-1" 
              style={{ 
                color: activeAuditType === 'xfe' ? 'white' : '#111827', 
                fontSize: '1.5rem', 
                fontWeight: '800' 
              }}
            >
              XFE AUDITS
            </h3>
            
          </button>

          <button
            onClick={() => setActiveAuditType('ilms')}
            className="flex-1 min-w-[280px] p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300"
            style={{
              background: activeAuditType === 'ilms' ? 'linear-gradient(135deg, #22C55E, #16a34a)' : 'white',
              borderColor: activeAuditType === 'ilms' ? '#22C55E' : '#E5E7EB',
              boxShadow: activeAuditType === 'ilms' ? '0 10px 40px rgba(34, 197, 94, 0.3)' : 'none'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8" style={{ color: activeAuditType === 'ilms' ? 'white' : '#22C55E' }} />
              <span 
                className="px-4 py-2 rounded-lg text-sm"
                style={{ 
                  background: activeAuditType === 'ilms' ? 'rgba(255,255,255,0.2)' : 'rgba(34, 197, 94, 0.1)',
                  color: activeAuditType === 'ilms' ? 'white' : '#22C55E',
                  fontWeight: '700'
                }}
              >
                {audits.filter(a => a.auditType === 'ilms').length}
              </span>
            </div>
            <h3 
              className="m-0 mb-1" 
              style={{ 
                color: activeAuditType === 'ilms' ? 'white' : '#111827', 
                fontSize: '1.5rem', 
                fontWeight: '800' 
              }}
            >
              ILMS AUDITS
            </h3>
            
          </button>
        </div>

        {/* Filters Section - Dynamic based on Audit Type */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5" style={{ color: '#0AAE9A' }} />
            <h3 className="m-0" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
              Filter Data - {activeAuditType.toUpperCase()} Audits
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {renderFilters()}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedFilters({ 
                    month: 'all', year: 'all', circle: 'all', zbm: 'all', tsm: 'all',
                    storeName: 'all', croName: 'all', pincode: 'all', xfeName: 'all',
                    ambassadorName: 'all', auditDate: 'all', dropReason: 'all'
                  });
                  setTimeFilter('all');
                }}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#EF4444] transition-all"
                style={{ fontSize: '0.875rem', fontWeight: '600', color: '#EF4444' }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      {filteredAudits.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-200">
          <div className="inline-flex p-6 rounded-3xl mb-6" style={{ background: '#E0F7F4' }}>
            <AlertCircle className="w-16 h-16" style={{ color: '#0AAE9A' }} />
          </div>
          <h3 className="mb-3" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700' }}>
            No Data Available
          </h3>
          <p className="mb-0" style={{ color: '#6B7280' }}>
            No {activeAuditType.toUpperCase()} audits found with the selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {/* Total Planned */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6" style={{ color: '#0AAE9A' }} />
              </div>
              <div className="mb-1" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>
                {metrics.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>Total Planned</div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-green-100">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
                <span className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', fontWeight: '700' }}>
                  {metrics.completionRate}%
                </span>
              </div>
              <div className="mb-1" style={{ fontSize: '2rem', fontWeight: '800', color: '#22C55E' }}>
                {metrics.completed}
              </div>
              <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Completed</div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6" style={{ color: '#F97316' }} />
                <span className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', fontWeight: '700' }}>
                  {metrics.pendingRate}%
                </span>
              </div>
              <div className="mb-1" style={{ fontSize: '2rem', fontWeight: '800', color: '#F97316' }}>
                {metrics.pending}
              </div>
              <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Pending</div>
            </div>

            {/* TAT Compliance */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-6 h-6" style={{ color: '#2563EB' }} />
                <span className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', fontWeight: '700' }}>
                  {metrics.tatCompliance}%
                </span>
              </div>
              <div className="mb-1" style={{ fontSize: '2rem', fontWeight: '800', color: '#2563EB' }}>
                {metrics.tatCount}
              </div>
              <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>TAT 24-48hrs</div>
            </div>

            {/* QC Done */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                <span className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', fontWeight: '700' }}>
                  {metrics.qcRate}%
                </span>
              </div>
              <div className="mb-1" style={{ fontSize: '2rem', fontWeight: '800', color: '#8B5CF6' }}>
                {metrics.qcDone}
              </div>
              <div className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>QC Done</div>
            </div>

            {/* Avg Overall Score */}
            <div className="bg-gradient-to-br from-[#0AAE9A] to-[#078672] rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-5 border-2 border-white">
              <div className="flex items-center justify-between mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="mb-1 text-white" style={{ fontSize: '2rem', fontWeight: '800' }}>
                {metrics.avgOverallScore}%
              </div>
              <div className="text-xs text-white" style={{ fontWeight: '600', opacity: 0.9 }}>Avg Overall Score</div>
            </div>
          </div>

          {/* Score Quality Metrics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
                <Star className="w-5 h-5" style={{ color: '#0AAE9A' }} />
                Average Scores
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #0AAE9A, #078672)' }}>
                  <div className="text-xs mb-2 text-white" style={{ fontWeight: '700', opacity: 0.9 }}>OVERALL AUDIT SCORE</div>
                  <div className="text-white" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.avgOverallScore}%</div>
                  <div className="text-xs text-white mt-2" style={{ opacity: 0.8 }}>All completed audits</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)' }}>
                  <div className="text-xs mb-2 text-white" style={{ fontWeight: '700', opacity: 0.9 }}>WITHOUT FATAL SCORE</div>
                  <div className="text-white" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.avgWithoutFatalScore}%</div>
                  <div className="text-xs text-white mt-2" style={{ opacity: 0.8 }}>Non-fatal audits only</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>
                  <div className="text-xs mb-2 text-white" style={{ fontWeight: '700', opacity: 0.9 }}>CUSTOMER EXPERIENCE</div>
                  <div className="text-white" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.avgCXRating}/5</div>
                  <div className="text-xs text-white mt-2" style={{ opacity: 0.8 }}>Customer rating average</div>
                </div>
              </div>
            </div>

            {/* Planned vs Completed */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
                <Activity className="w-5 h-5" style={{ color: '#0AAE9A' }} />
                Planned vs Completed
              </h3>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: metrics.completed, color: '#22C55E' },
                        { name: 'Pending', value: metrics.pending, color: '#F97316' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Completed', value: metrics.completed, color: '#22C55E' },
                        { name: 'Pending', value: metrics.pending, color: '#F97316' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <div className="text-xs mb-1" style={{ color: '#166534', fontWeight: '700' }}>Completion</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#22C55E' }}>{metrics.completionRate}%</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
                  <div className="text-xs mb-1" style={{ color: '#9a3412', fontWeight: '700' }}>Pending</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F97316' }}>{metrics.pendingRate}%</div>
                </div>
              </div>
            </div>

            {/* Audit Drop/Miss Reasons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#FBBF24' }} />
                Drop/Miss Reasons
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                  <span style={{ color: '#111827', fontWeight: '600', fontSize: '0.8rem' }}>Auditor Not Assigned</span>
                  <span className="px-3 py-1 rounded-lg" style={{ background: '#E0F7F4', color: '#0AAE9A', fontWeight: '700', fontSize: '0.875rem' }}>
                    {metrics.unassignedAuditor}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                  <span style={{ color: '#111827', fontWeight: '600', fontSize: '0.8rem' }}>Executive Not Available</span>
                  <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', fontWeight: '700', fontSize: '0.875rem' }}>
                    {metrics.executiveNotAvailable}
                  </span>
                </div>
                {activeAuditType === 'ilms' && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                      <span style={{ color: '#111827', fontWeight: '600', fontSize: '0.8rem' }}>No Call Received</span>
                      <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontWeight: '700', fontSize: '0.875rem' }}>
                        {metrics.noCallReceived}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                      <span style={{ color: '#111827', fontWeight: '600', fontSize: '0.8rem' }}>No Executive Assigned</span>
                      <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontWeight: '700', fontSize: '0.875rem' }}>
                        {metrics.noExecutiveAssigned}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                  <span style={{ color: '#111827', fontWeight: '600', fontSize: '0.8rem' }}>Other Reasons</span>
                  <span className="px-3 py-1 rounded-lg" style={{ background: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', fontWeight: '700', fontSize: '0.875rem' }}>
                    {metrics.otherReasons}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TAT & QC Compliance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* TAT Compliance Detailed */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
                <Zap className="w-6 h-6" style={{ color: '#2563EB' }} />
                TAT Compliance (24-48 hours)
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#dbeafe', background: '#eff6ff' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#1e40af', fontWeight: '700' }}>WITHIN TAT</span>
                    <CheckCircle className="w-5 h-5" style={{ color: '#2563EB' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2563EB' }}>{metrics.tatCount}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${metrics.tatCompliance}%`, background: '#2563EB' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#2563EB', fontWeight: '700' }}>{metrics.tatCompliance}%</span>
                  </div>
                </div>
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#991b1b', fontWeight: '700' }}>EXCEEDED TAT</span>
                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#EF4444' }}>{metrics.tatNonCompliance}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-red-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${metrics.tatNonComplianceRate}%`, background: '#EF4444' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#EF4444', fontWeight: '700' }}>{metrics.tatNonComplianceRate}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#F0F9FF', border: '2px solid #BFDBFE' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5" style={{ color: '#2563EB' }} />
                  <span className="text-xs" style={{ color: '#1e40af', fontWeight: '700' }}>SOP COMPLIANCE TARGET: 90%</span>
                </div>
                <div className="text-sm" style={{ color: '#1e3a8a', fontWeight: '600' }}>
                  Current: {metrics.tatCompliance}% | 
                  {parseFloat(metrics.tatCompliance) >= 90 ? (
                    <span style={{ color: '#22C55E' }}> ✓ Target Achieved</span>
                  ) : (
                    <span style={{ color: '#EF4444' }}> ✗ Below Target</span>
                  )}
                </div>
              </div>
            </div>

            {/* QC Status Detailed */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
                <Award className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                Quality Control Status
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#6b21a8', fontWeight: '700' }}>QC DONE</span>
                    <CheckCircle className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8B5CF6' }}>{metrics.qcDone}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${metrics.qcRate}%`, background: '#8B5CF6' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#8B5CF6', fontWeight: '700' }}>{metrics.qcRate}%</span>
                  </div>
                </div>
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#fed7aa', background: '#fff7ed' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#9a3412', fontWeight: '700' }}>QC PENDING</span>
                    <Clock className="w-5 h-5" style={{ color: '#F97316' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F97316' }}>{metrics.qcPending}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-orange-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${metrics.qcPendingRate}%`, background: '#F97316' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#F97316', fontWeight: '700' }}>{metrics.qcPendingRate}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#FAF5FF', border: '2px solid #E9D5FF' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  <span className="text-xs" style={{ color: '#6b21a8', fontWeight: '700' }}>QUALITY TARGET: 100%</span>
                </div>
                <div className="text-sm" style={{ color: '#581c87', fontWeight: '600' }}>
                  Current: {metrics.qcRate}% | 
                  {parseFloat(metrics.qcRate) === 100 ? (
                    <span style={{ color: '#22C55E' }}> ✓ All Audits Checked</span>
                  ) : (
                    <span style={{ color: '#F97316' }}> {metrics.qcPending} Pending Review</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fatal vs Non-Fatal Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
                Fatal vs Non-Fatal Audits
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#991b1b', fontWeight: '700' }}>FATAL AUDITS</span>
                    <span className="px-2 py-1 rounded-lg text-xs" style={{ background: '#EF4444', color: 'white', fontWeight: '700' }}>
                      {metrics.fatalRate}%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#EF4444' }}>{metrics.fatalAudits}</div>
                  <div className="text-xs mt-2" style={{ color: '#991b1b', fontWeight: '600' }}>Score &lt; 70%</div>
                </div>
                <div className="p-5 rounded-xl border-2" style={{ borderColor: '#dcfce7', background: '#f0fdf4' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#166534', fontWeight: '700' }}>NON-FATAL</span>
                    <span className="px-2 py-1 rounded-lg text-xs" style={{ background: '#22C55E', color: 'white', fontWeight: '700' }}>
                      {metrics.nonFatalRate}%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#22C55E' }}>{metrics.nonFatalAudits}</div>
                  <div className="text-xs mt-2" style={{ color: '#166534', fontWeight: '600' }}>Score &ge; 70%</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Fatal', value: metrics.fatalAudits, color: '#EF4444' },
                      { name: 'Non-Fatal', value: metrics.nonFatalAudits, color: '#22C55E' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Fatal', value: metrics.fatalAudits, color: '#EF4444' },
                      { name: 'Non-Fatal', value: metrics.nonFatalAudits, color: '#22C55E' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Score Trends - Highest & Lowest */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#0AAE9A' }} />
                Score Trends - High & Low
              </h3>
              <div className="space-y-4">
                <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-7 h-7 text-white" />
                    <span className="text-sm text-white" style={{ fontWeight: '700', opacity: 0.9 }}>HIGHEST SCORE</span>
                  </div>
                  <div className="text-white" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>{metrics.highestScore}%</div>
                  <div className="text-sm text-white mt-3" style={{ opacity: 0.85, fontWeight: '600' }}>
                    Best performing audit
                  </div>
                </div>
                <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #EF4444, #dc2626)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingDown className="w-7 h-7 text-white" />
                    <span className="text-sm text-white" style={{ fontWeight: '700', opacity: 0.9 }}>LOWEST SCORE</span>
                  </div>
                  <div className="text-white" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1' }}>{metrics.lowestScore}%</div>
                  <div className="text-sm text-white mt-3" style={{ opacity: 0.85, fontWeight: '600' }}>
                    Requires immediate attention
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Analysis - Dynamic Multi-View */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200 mb-6 lg:mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="m-0 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
                <Calendar className="w-6 h-6" style={{ color: '#0AAE9A' }} />
                Performance Trend Analysis
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={trendView}
                  onChange={(e) => setTrendView(e.target.value as TrendView)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#0AAE9A] transition-all"
                  style={{ fontSize: '0.875rem', fontWeight: '600' }}
                >
                  <option value="month">Month-on-Month</option>
                  <option value="year">Year Wise</option>
                  <option value="circle">Circle Wise</option>
                  {activeAuditType === 'store' && <option value="zbm">ZBM Wise</option>}
                  {activeAuditType === 'store' && <option value="tsm">TSM Wise</option>}
                  <option value="store">Store Wise (Top 20)</option>
                  <option value="pincode">Pincode Wise (Top 20)</option>
                  <option value="executive">Executive Wise (Top 20)</option>
                </select>
              </div>
            </div>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" angle={trendData.length > 10 ? -45 : 0} textAnchor={trendData.length > 10 ? "end" : "middle"} height={trendData.length > 10 ? 80 : 30} />
                  <YAxis stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #E5E7EB', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#0AAE9A" radius={[8, 8, 0, 0]} name="Avg Score">
                    {trendData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.avgScore >= 85 ? '#22C55E' : 
                          entry.avgScore >= 70 ? '#FBBF24' : 
                          '#EF4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12" style={{ color: '#6B7280' }}>
                No trend data available for selected view
              </div>
            )}
          </div>

          {/* Main Parameter Performance with Drill-Down */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200 mb-6 lg:mb-8">
            <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
              <Activity className="w-6 h-6" style={{ color: '#0AAE9A' }} />
              Main Parameter Performance - Highest to Lowest
              <span className="text-xs px-3 py-1 rounded-lg ml-auto" style={{ background: '#E0F7F4', color: '#078672', fontWeight: '700' }}>
                Click to view sub-parameters
              </span>
            </h3>
            <div className="space-y-4">
              {mainParameterPerformance.map((param, index) => (
                <div key={index}>
                  <div 
                    onClick={() => setExpandedParameter(expandedParameter === param.parameter ? null : param.parameter)}
                    className="p-5 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer" 
                    style={{ borderColor: '#E5E7EB', background: expandedParameter === param.parameter ? '#F9FAFB' : 'white' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-2 rounded-lg" style={{ background: `${param.color}20`, color: param.color, fontWeight: '800', fontSize: '1.25rem' }}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ color: '#111827', fontWeight: '700', fontSize: '1.05rem' }}>{param.parameter}</span>
                            {expandedParameter === param.parameter ? (
                              <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} />
                            ) : (
                              <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />
                            )}
                          </div>
                          <div className="text-xs mt-1" style={{ color: '#6B7280', fontWeight: '600' }}>
                            {param.subParameters.length} sub-parameters
                          </div>
                        </div>
                      </div>
                      <span style={{ color: param.color, fontWeight: '800', fontSize: '1.75rem' }}>{param.avgScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full transition-all" 
                        style={{ 
                          width: `${param.avgScore}%`,
                          backgroundColor: param.color
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Sub-Parameters Drill-Down */}
                  {expandedParameter === param.parameter && (
                    <div className="ml-8 mt-3 p-5 rounded-xl border-2 border-dashed" style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}>
                      <div className="mb-4 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5" style={{ color: '#0AAE9A' }} />
                        <span style={{ color: '#111827', fontWeight: '700', fontSize: '0.95rem' }}>Sub-Parameter Breakdown</span>
                      </div>
                      <div className="space-y-3">
                        {param.subParameters.map((sub, subIndex) => (
                          <div key={subIndex} className="p-4 rounded-lg" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                            <div className="flex items-center justify-between mb-2">
                              <span style={{ color: '#374151', fontWeight: '600', fontSize: '0.9rem' }}>{sub.name}</span>
                              <span style={{ 
                                color: sub.avgScore >= 85 ? '#22C55E' : sub.avgScore >= 70 ? '#FBBF24' : '#EF4444',
                                fontWeight: '800',
                                fontSize: '1.125rem'
                              }}>
                                {sub.avgScore}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all" 
                                style={{ 
                                  width: `${sub.avgScore}%`,
                                  backgroundColor: sub.avgScore >= 85 ? '#22C55E' : sub.avgScore >= 70 ? '#FBBF24' : '#EF4444'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Fatal Reasons - Main & Sub Parameters */}
          <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200 mb-6 lg:mb-8">
            <h3 className="mb-6 flex items-center gap-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>
              <AlertTriangle className="w-6 h-6" style={{ color: '#EF4444' }} />
              Top 5 Recurring Fatal Error Reasons
              <span className="text-xs px-3 py-1 rounded-lg ml-auto" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontWeight: '700' }}>
                Main → Sub Parameter
              </span>
            </h3>
            <div className="space-y-4">
              {top5FatalReasons.map((reason, index) => (
                <div key={index} className="p-5 rounded-xl border-2 hover:shadow-md transition-all" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 rounded-lg" style={{ background: '#EF4444', color: 'white', fontWeight: '800', fontSize: '1.125rem' }}>
                        #{index + 1}
                      </div>
                      <div>
                        <div style={{ color: '#991b1b', fontWeight: '700', fontSize: '0.95rem' }}>{reason.mainParameter}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <ChevronRight className="w-4 h-4" style={{ color: '#dc2626' }} />
                          <span style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.85rem' }}>{reason.subParameter}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ color: '#EF4444', fontWeight: '800', fontSize: '1.5rem' }}>{reason.count}</div>
                      <div className="text-xs" style={{ color: '#991b1b', fontWeight: '600' }}>occurrences</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-red-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all" 
                          style={{ 
                            width: `${reason.percentage}%`,
                            backgroundColor: '#EF4444'
                          }}
                        />
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg" style={{ background: '#EF4444', color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>
                      {reason.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause Analysis & Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-4 lg:p-8 border-2 border-purple-200 mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="m-0" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '800' }}>
                  Root Cause Analysis & Insights
                </h3>
                <p className="m-0 mt-1" style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>
                  Top 5 Reasons for Low Scores - Action Required
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {top5LowScoreReasons.map((reason, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border-2 border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="px-3 py-1 rounded-lg mt-1" style={{ 
                        background: reason.impact === 'High' ? '#FEE2E2' : reason.impact === 'Medium' ? '#FED7AA' : '#E0E7FF',
                        color: reason.impact === 'High' ? '#991B1B' : reason.impact === 'Medium' ? '#9A3412' : '#3730A3',
                        fontWeight: '800',
                        fontSize: '0.75rem'
                      }}>
                        {reason.impact.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div style={{ color: '#111827', fontWeight: '700', fontSize: '0.95rem', lineHeight: '1.4' }}>
                          {reason.reason}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <AlertCircle className="w-4 h-4" style={{ color: '#6B7280' }} />
                          <span className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>
                            Affected {reason.affectedAudits} audits
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg" style={{ background: '#E0F7F4', color: '#078672', fontWeight: '800' }}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all" 
                      style={{ 
                        width: `${Math.min(100, (reason.affectedAudits / metrics.total * 100)).toFixed(0)}%`,
                        background: reason.impact === 'High' ? '#EF4444' : reason.impact === 'Medium' ? '#F97316' : '#6366F1'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Areas of Improvement */}
          <div className="bg-gradient-to-br from-[#0AAE9A] to-[#078672] rounded-2xl shadow-2xl p-4 lg:p-8 border-2 border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/20">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="m-0 text-white" style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                  Top 5 Areas of Improvement
                </h3>
                <p className="m-0 mt-1 text-white" style={{ fontSize: '0.95rem', opacity: 0.9, fontWeight: '500' }}>
                  Strategic focus areas to increase overall audit scores
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
              {top5ImprovementAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-lg" style={{ background: '#E0F7F4', color: '#0AAE9A', fontWeight: '800' }}>
                      #{index + 1}
                    </div>
                    <div className="px-3 py-1 rounded-lg text-xs" style={{ 
                      background: area.priority === 'Critical' ? '#FEE2E2' : area.priority === 'High' ? '#FED7AA' : '#E0E7FF',
                      color: area.priority === 'Critical' ? '#991B1B' : area.priority === 'High' ? '#9A3412' : '#3730A3',
                      fontWeight: '700'
                    }}>
                      {area.priority}
                    </div>
                  </div>
                  <div className="mb-4" style={{ color: '#111827', fontWeight: '700', fontSize: '0.95rem', minHeight: '45px' }}>
                    {area.area}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Current</span>
                        <span className="text-xs" style={{ color: '#EF4444', fontWeight: '700' }}>{area.currentScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${area.currentScore}%`,
                            backgroundColor: '#EF4444'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: '#6B7280', fontWeight: '600' }}>Target</span>
                        <span className="text-xs" style={{ color: '#22C55E', fontWeight: '700' }}>{area.targetScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${area.targetScore}%`,
                            backgroundColor: '#22C55E'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl mt-4" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <div className="text-xs mb-1" style={{ color: '#991b1b', fontWeight: '600' }}>Improvement Gap</div>
                    <div className="flex items-baseline gap-1">
                      <span style={{ color: '#EF4444', fontWeight: '800', fontSize: '1.5rem' }}>+{area.gap.toFixed(1)}</span>
                      <span className="text-xs" style={{ color: '#EF4444', fontWeight: '700' }}>%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
