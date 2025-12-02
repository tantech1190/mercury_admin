import { Users, ClipboardList, Clock, CheckCircle, Calendar, ClipboardCheck } from 'lucide-react';
import { Auditor, Assignment, Audit } from '../types';

interface DashboardHomeProps {
  auditors: Auditor[];
  assignments: Assignment[];
  audits: Audit[];
  totalAuditorsCount?: number;
}

export function DashboardHome({ auditors, assignments, audits, totalAuditorsCount }: DashboardHomeProps) {
  console.log('🏠 DashboardHome received:');
  console.log('  - auditors:', auditors.length);
  console.log('  - totalAuditorsCount:', totalAuditorsCount);
  console.log('  - audits:', audits.length);
  
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;

  const unassignedAudits = audits.filter(a => a.status === 'unassigned').length;
  const completedAudits = audits.filter(a => a.status === 'completed').length;
  const atRiskAudits = audits.filter(a => a.status === 'at-risk').length;

  // Calculate metrics for each auditor from audits data
  const calculateAuditorMetrics = (auditorName: string) => {
    const normalizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedAuditorName = normalizeName(auditorName);
    
    let totalAssigned = 0;
    let totalCompleted = 0;
    let totalScore = 0;
    let scoreCount = 0;
    
    audits.forEach((audit: any) => {
      // Extract auditor name from audit
      let auditAuditorName = '';
      
      if (audit.rawData) {
        auditAuditorName = audit.rawData['Name of Auditor'] || 
                          audit.rawData['Name of auditor'] || 
                          audit.rawData['Auditor Name'] ||
                          audit.rawData['Name of the CRO/Executive'] || 
                          audit.rawData.auditor || 
                          audit.rawData.auditorName || '';
      }
      
      // For XFE audits only, use storeName as fallback
      if (!auditAuditorName && audit.auditType?.toLowerCase() === 'xfe') {
        auditAuditorName = audit.storeName;
      }
      
      if (!auditAuditorName || typeof auditAuditorName !== 'string') {
        return;
      }
      
      // Check if this audit belongs to the current auditor
      if (normalizeName(auditAuditorName) === normalizedAuditorName) {
        totalAssigned++;
        
        // If completed, count it and add score
        if (audit.status === 'completed') {
          totalCompleted++;
          
          // Extract score
          const score = audit.totalScore || audit.score || 0;
          if (score > 0) {
            totalScore += score;
            scoreCount++;
          }
        }
      }
    });
    
    const completionRate = totalAssigned > 0 ? (totalCompleted / totalAssigned * 100) : 0;
    const averageScore = scoreCount > 0 ? (totalScore / scoreCount) : 0;
    
    return {
      totalAssigned,
      totalCompleted,
      completionRate,
      averageScore
    };
  };

  const stats = [
    {
      title: 'Total Auditors',
      value: totalAuditorsCount ?? auditors.length,
      icon: Users,
      bgColor: '#E0F7F4',
      iconColor: '#0AAE9A',
    },
    {
      title: 'Total Audits',
      value: audits.length,
      icon: ClipboardCheck,
      bgColor: 'rgba(37, 99, 235, 0.1)',
      iconColor: '#2563EB',
    },
    {
      title: 'Completed Audits',
      value: completedAudits,
      icon: CheckCircle,
      bgColor: 'rgba(34, 197, 94, 0.1)',
      iconColor: '#22C55E',
    },
    {
      title: 'At Risk',
      value: atRiskAudits,
      icon: Clock,
      bgColor: 'rgba(251, 191, 36, 0.1)',
      iconColor: '#FBBF24',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="mb-3" style={{ color: '#111827', fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em' }}>Welcome Back, Admin</h2>
        <p className="m-0 text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>Here's an overview of your audit management system</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className="bg-white rounded-2xl shadow-lg p-7 border border-[#E5E7EB] hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden group h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${stat.bgColor} 0%, white 100%)` }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: stat.iconColor, filter: 'blur(40px)' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0" style={{ backgroundColor: stat.bgColor }}>
                  <stat.icon className="w-7 h-7" style={{ color: stat.iconColor }} />
                </div>
                <div className="text-right">
                  <span className="block text-4xl mb-1" style={{ color: '#0AAE9A', fontWeight: '700', letterSpacing: '-0.02em' }}>{stat.value}</span>
                </div>
              </div>
              <p className="text-sm m-0" style={{ color: '#6B7280', fontWeight: '600', letterSpacing: '0.3px' }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Auditors List */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E7EB] w-full mb-8">
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '2px solid #E5E7EB' }}>
          <div className="p-3 rounded-2xl flex-shrink-0 shadow-lg" style={{ background: '#E0F7F4' }}>
            <Users className="w-7 h-7" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h3 className="m-0 mb-1" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              All Auditors <span style={{ color: '#0AAE9A', fontSize: '1.25rem' }}>({totalAuditorsCount ?? auditors.length})</span>
            </h3>
            <p className="text-sm m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Complete performance overview of all auditors</p>
          </div>
        </div>
        
        {auditors.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex p-6 rounded-3xl mb-6 shadow-lg" style={{ background: '#E0F7F4' }}>
              <Users className="w-16 h-16" style={{ color: '#0AAE9A' }} />
            </div>
            <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>No Auditors Yet</h4>
            <p className="m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Add your first auditor to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {auditors.map((auditor, index) => {
              // Calculate real-time metrics from audits data
              const metrics = calculateAuditorMetrics(auditor.name);
              const isActive = auditor.isActive ?? (auditor.status === 'active');
              
              return (
                <div
                  key={auditor._id || auditor.id}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-xl border-2 border-transparent hover:border-[#0AAE9A] transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-300" style={{ background: 'linear-gradient(to bottom, #0AAE9A, #078672)' }}></div>
                  
                  <div className="flex-1 min-w-0 pl-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: isActive ? '#0AAE9A' : '#6B7280', boxShadow: `0 0 10px ${isActive ? 'rgba(10, 174, 154, 0.5)' : 'rgba(107, 114, 128, 0.3)'}` }}></div>
                      <p className="m-0 truncate" style={{ color: '#111827', fontWeight: '600', fontSize: '1.05rem' }}>
                        {auditor.name}
                      </p>
                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs uppercase tracking-wide" style={{ 
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: '#22C55E',
                          fontWeight: '700'
                        }}>
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs uppercase tracking-wide" style={{ 
                          backgroundColor: 'rgba(107, 114, 128, 0.1)',
                          color: '#6B7280',
                          fontWeight: '700'
                        }}>
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="ml-5 flex flex-wrap items-center gap-4">
                      <p className="text-sm m-0 flex items-center gap-2" style={{ color: '#6B7280', fontWeight: '500' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {auditor.email}
                      </p>
                      {auditor.phone && (
                        <p className="text-sm m-0 flex items-center gap-2" style={{ color: '#6B7280', fontWeight: '500' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {auditor.phone}
                        </p>
                      )}
                      {auditor.circles && auditor.circles.length > 0 && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: '#6B7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex flex-wrap gap-1">
                            {auditor.circles.map((circle, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-xs" style={{ 
                                backgroundColor: '#E0F7F4',
                                color: '#0AAE9A',
                                fontWeight: '600'
                              }}>
                                {circle}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 flex-shrink-0 pl-3 lg:pl-0">
                    <div className="text-center px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(10, 174, 154, 0.1)' }}>
                      <p className="text-xs m-0 mb-1" style={{ color: '#6B7280', fontWeight: '500' }}>Assigned</p>
                      <p className="m-0" style={{ color: '#0AAE9A', fontWeight: '700', fontSize: '1.1rem' }}>{metrics.totalAssigned}</p>
                    </div>
                    <div className="text-center px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                      <p className="text-xs m-0 mb-1" style={{ color: '#6B7280', fontWeight: '500' }}>Completed</p>
                      <p className="m-0" style={{ color: '#22C55E', fontWeight: '700', fontSize: '1.1rem' }}>{metrics.totalCompleted}</p>
                    </div>
                    <div className="text-center px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <p className="text-xs m-0 mb-1" style={{ color: '#6B7280', fontWeight: '500' }}>Rate</p>
                      <p className="m-0" style={{ color: '#2563EB', fontWeight: '700', fontSize: '1.1rem' }}>{metrics.completionRate.toFixed(0)}%</p>
                    </div>
                    <div className="text-center px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                      <p className="text-xs m-0 mb-1" style={{ color: '#6B7280', fontWeight: '500' }}>Avg Score</p>
                      <p className="m-0" style={{ color: '#FBBF24', fontWeight: '700', fontSize: '1.1rem' }}>{metrics.averageScore > 0 ? metrics.averageScore.toFixed(1) : '-'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Audits */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E7EB] w-full mb-8">
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '2px solid #E5E7EB' }}>
          <div className="p-3 rounded-2xl flex-shrink-0 shadow-lg" style={{ background: '#E0F7F4' }}>
            <ClipboardCheck className="w-7 h-7" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h3 className="m-0 mb-1" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Recent Audits</h3>
            <p className="text-sm m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Track your latest audit activities</p>
          </div>
        </div>
        
        {audits.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex p-6 rounded-3xl mb-6 shadow-lg" style={{ background: '#E0F7F4' }}>
              <ClipboardCheck className="w-16 h-16" style={{ color: '#0AAE9A' }} />
            </div>
            <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>No Audits Yet</h4>
            <p className="m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Create your first audit to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {audits.slice(0, 5).map((audit, index) => (
              <div
                key={audit.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl border-2 border-transparent hover:border-[#0AAE9A] transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-300" style={{ background: 'linear-gradient(to bottom, #0AAE9A, #078672)' }}></div>
                
                <div className="flex-1 min-w-0 pl-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: '#0AAE9A', boxShadow: '0 0 10px rgba(10, 174, 154, 0.5)' }}></div>
                    <p className="m-0 truncate" style={{ color: '#111827', fontWeight: '600', fontSize: '1.05rem' }}>
                      {audit.storeCode} - {audit.storeName}
                    </p>
                  </div>
                  <div className="ml-5 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-xs uppercase tracking-wide" style={{ 
                      backgroundColor: audit.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : 
                                     audit.status === 'at-risk' ? 'rgba(251, 191, 36, 0.1)' :
                                     audit.status === 'unassigned' ? 'rgba(107, 114, 128, 0.1)' : '#E0F7F4',
                      color: audit.status === 'completed' ? '#22C55E' : 
                             audit.status === 'at-risk' ? '#FBBF24' :
                             audit.status === 'unassigned' ? '#6B7280' : '#0AAE9A',
                      fontWeight: '700'
                    }}>
                      {audit.status}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs uppercase tracking-wide" style={{ 
                      backgroundColor: '#E0F7F4',
                      color: '#0AAE9A',
                      fontWeight: '700'
                    }}>
                      {audit.auditType}
                    </span>
                    <p className="text-sm m-0" style={{ color: '#6B7280', fontWeight: '500' }}>
                      {audit.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2 flex-shrink-0 pl-3 sm:pl-0">
                  {audit.auditorName && (
                    <span className="text-sm" style={{ color: '#0AAE9A', fontWeight: '600' }}>
                      {audit.auditorName}
                    </span>
                  )}
                  <p className="text-sm m-0 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ color: '#6B7280', fontWeight: '500', backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>
                    <Calendar className="w-4 h-4" />
                    {new Date(audit.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Recent Assignments */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E7EB] w-full">
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '2px solid #E5E7EB' }}>
          <div className="p-3 rounded-2xl flex-shrink-0 shadow-lg" style={{ background: '#E0F7F4' }}>
            <ClipboardList className="w-7 h-7" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h3 className="m-0 mb-1" style={{ color: '#111827', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Recent Assignments</h3>
            <p className="text-sm m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Track your latest audit assignments</p>
          </div>
        </div>
        
        {assignments.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex p-6 rounded-3xl mb-6 shadow-lg" style={{ background: '#E0F7F4' }}>
              <ClipboardList className="w-16 h-16" style={{ color: '#0AAE9A' }} />
            </div>
            <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '600' }}>No Assignments Yet</h4>
            <p className="m-0" style={{ color: '#6B7280', fontWeight: '500' }}>Create your first assignment to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.slice(0, 5).map((assignment, index) => (
              <div
                key={assignment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl border-2 border-transparent hover:border-[#0AAE9A] transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-300" style={{ background: 'linear-gradient(to bottom, #0AAE9A, #078672)' }}></div>
                
                <div className="flex-1 min-w-0 pl-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: '#0AAE9A', boxShadow: '0 0 10px rgba(10, 174, 154, 0.5)' }}></div>
                    <p className="m-0 truncate" style={{ color: '#111827', fontWeight: '600', fontSize: '1.05rem' }}>{assignment.title}</p>
                  </div>
                  <p className="ml-5 text-sm m-0 flex items-center gap-2" style={{ color: '#6B7280', fontWeight: '500' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {assignment.auditorName}
                  </p>
                </div>
                
                <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2 flex-shrink-0 pl-3 sm:pl-0">
                  <span
                    className="inline-block px-5 py-2 rounded-xl text-sm shadow-md border-2 whitespace-nowrap transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: assignment.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : assignment.status === 'in-progress' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      color: assignment.status === 'completed' ? '#22C55E' : assignment.status === 'in-progress' ? '#2563EB' : '#FBBF24',
                      borderColor: assignment.status === 'completed' ? '#22C55E' : assignment.status === 'in-progress' ? '#2563EB' : '#FBBF24',
                      fontWeight: '600'
                    }}
                  >
                    {assignment.status === 'in-progress' ? 'In Progress' : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                  <p className="text-sm m-0 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ color: '#6B7280', fontWeight: '500', backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>
                    <Calendar className="w-4 h-4" />
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
