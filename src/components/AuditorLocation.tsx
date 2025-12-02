import { MapPin, Users, Navigation } from 'lucide-react';
import { Auditor } from '../types';

interface AuditorLocationProps {
  auditors: Auditor[];
}

export function AuditorLocation({ auditors }: AuditorLocationProps) {
  const auditorsWithLocation = auditors.filter(a => a.location);

  const getCircleColor = (circles: string[]) => {
    const circleColors: { [key: string]: string } = {
      'AP': '#2563EB',
      'BH': '#22C55E',
      'DEL': '#F97316',
      'Guj': '#FBBF24',
      'HR': '#0AAE9A',
      'JK': '#9333EA',
      'KER': '#EC4899',
      'KK': '#14B8A6',
      'MPCG': '#8B5CF6',
      'Mum': '#F59E0B',
      'NESA': '#10B981',
      'OR': '#06B6D4',
      'PB': '#EF4444',
      'RAJ': '#6366F1',
      'ROM': '#84CC16',
      'TN': '#F43F5E',
      'UPE': '#3B82F6',
      'UPW': '#A855F7',
      'WB': '#059669',
    };
    return circleColors[circles[0]] || '#6B7280';
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl shadow-lg" style={{ background: '#E0F7F4' }}>
            <MapPin className="w-8 h-8" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h2 className="mb-1" style={{ color: '#111827', fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em' }}>Auditor Locations</h2>
            <p className="m-0 text-lg" style={{ color: '#6B7280', fontWeight: '500' }}>Track auditor locations in real-time</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#E0F7F4' }}>
                <Users className="w-6 h-6" style={{ color: '#0AAE9A' }} />
              </div>
            </div>
            <div className="mb-2" style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{auditors.length}</div>
            <div style={{ color: '#6B7280', fontSize: '0.95rem', fontWeight: '600' }}>Total Auditors</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Navigation className="w-6 h-6" style={{ color: '#22C55E' }} />
              </div>
            </div>
            <div className="mb-2" style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{auditorsWithLocation.length}</div>
            <div style={{ color: '#6B7280', fontSize: '0.95rem', fontWeight: '600' }}>Location Enabled</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <MapPin className="w-6 h-6" style={{ color: '#EF4444' }} />
              </div>
            </div>
            <div className="mb-2" style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{auditors.length - auditorsWithLocation.length}</div>
            <div style={{ color: '#6B7280', fontSize: '0.95rem', fontWeight: '600' }}>No Location Data</div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#E5E7EB]">
          <h3 className="mb-6" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>Live Map View</h3>
          <div 
            className="w-full rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ 
              height: '400px',
              background: 'linear-gradient(135deg, #E0F7F4 0%, #F5F7FA 100%)',
              border: '2px dashed #0AAE9A'
            }}
          >
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: '#0AAE9A' }} />
              <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>Map Integration</h4>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                Connect to Google Maps or Mapbox API to display auditor locations
              </p>
              <p className="text-sm mt-4" style={{ color: '#9CA3AF' }}>
                This feature requires backend integration and location permissions
              </p>
            </div>
          </div>
        </div>

        {/* Auditor Location List */}
        <div className="space-y-4">
          <h3 className="mb-4" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>Auditor Location Details</h3>
          
          {auditors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E7EB]">
              <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
              <p className="text-xl mb-2" style={{ color: '#6B7280', fontWeight: '600' }}>No auditors yet</p>
              <p style={{ color: '#9CA3AF' }}>Create auditor accounts to track their locations</p>
            </div>
          ) : (
            auditors.map((auditor) => (
              <div key={auditor.id} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E7EB] hover:shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="p-4 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${getCircleColor(auditor.circles)}15` }}
                    >
                      <MapPin 
                        className="w-6 h-6"
                        style={{ color: getCircleColor(auditor.circles) }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2" style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700' }}>
                        {auditor.name}
                      </h4>
                      <div className="space-y-1 mb-3" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                        <p className="m-0"><strong style={{ color: '#0AAE9A' }}>Email:</strong> {auditor.email}</p>
                        <p className="m-0"><strong style={{ color: '#0AAE9A' }}>Mobile:</strong> {auditor.mobileNumber}</p>
                        <p className="m-0">
                          <strong style={{ color: '#0AAE9A' }}>Circles:</strong>{' '}
                          {auditor.circles.map((circle, idx) => (
                            <span 
                              key={idx}
                              className="inline-block px-2 py-1 rounded-lg text-xs mr-2 mt-1"
                              style={{ 
                                backgroundColor: `${getCircleColor([circle])}15`,
                                color: getCircleColor([circle]),
                                fontWeight: '700'
                              }}
                            >
                              {circle}
                            </span>
                          ))}
                        </p>
                      </div>
                      {auditor.location ? (
                        <div 
                          className="mt-3 p-4 rounded-xl"
                          style={{ backgroundColor: '#E0F7F4' }}
                        >
                          <div className="flex items-start gap-2">
                            <Navigation className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: '#0AAE9A' }} />
                            <div>
                              <p className="m-0 mb-1" style={{ color: '#111827', fontWeight: '600', fontSize: '0.95rem' }}>
                                Current Location
                              </p>
                              <p className="m-0 text-sm" style={{ color: '#6B7280' }}>
                                {auditor.location.address}
                              </p>
                              <p className="m-0 text-xs mt-1" style={{ color: '#9CA3AF' }}>
                                Lat: {auditor.location.latitude.toFixed(6)}, Long: {auditor.location.longitude.toFixed(6)}
                              </p>
                              <p className="m-0 text-xs mt-1" style={{ color: '#9CA3AF' }}>
                                Last updated: {auditor.location.lastUpdated.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="mt-3 p-4 rounded-xl border-2 border-dashed"
                          style={{ borderColor: '#E5E7EB', backgroundColor: '#F5F7FA' }}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                            <p className="m-0 text-sm" style={{ color: '#9CA3AF', fontWeight: '600' }}>
                              Location tracking not enabled
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="px-4 py-2 rounded-xl transition-all"
                      style={{ 
                        backgroundColor: auditor.location ? '#0AAE9A' : '#E5E7EB',
                        color: auditor.location ? 'white' : '#9CA3AF',
                        fontWeight: '600',
                        cursor: auditor.location ? 'pointer' : 'not-allowed'
                      }}
                      disabled={!auditor.location}
                    >
                      View on Map
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl border-2 transition-all"
                      style={{ 
                        borderColor: '#0AAE9A',
                        color: '#0AAE9A',
                        fontWeight: '600'
                      }}
                    >
                      Request Location
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
