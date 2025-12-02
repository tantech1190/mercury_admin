import { useState, useEffect } from 'react';
import { X, Plus, MapPin } from 'lucide-react';
import { Auditor } from '../services/auditor.service';

interface AuditorFormProps {
  onSubmit: (auditor: any) => void;
  onCancel: () => void;
  initialData?: Auditor;
}

const CIRCLES = [
  'AP', 'BH', 'DEL', 'Guj', 'HR', 'JK', 'KER', 'KK',
  'MPCG', 'Mum', 'NESA', 'OR', 'PB', 'RAJ', 'ROM',
  'TN', 'UPE', 'UPW', 'WB',
];

export function AuditorForm({ onSubmit, onCancel, initialData }: AuditorFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    circles: initialData?.circles || ([] as string[]),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        circles: initialData.circles,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleCircle = (circle: string) => {
    setFormData((prev) => ({
      ...prev,
      circles: prev.circles.includes(circle)
        ? prev.circles.filter((c) => c !== circle)
        : [...prev.circles, circle],
    }));
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-8 sm:p-10 border border-white/50 w-full">
      <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '2px solid rgba(224, 247, 244, 0.5)' }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #E0F7F4, #B8F1E8)' }}>
            <Plus className="w-7 h-7" style={{ color: '#0AAE9A' }} />
          </div>
          <div>
            <h3 className="m-0 mb-1" style={{ color: '#0AAE9A', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {initialData ? 'Edit Auditor' : 'Create New Auditor'}
            </h3>
            <p className="text-sm m-0" style={{ color: '#6b7280', fontWeight: '500' }}>
              {initialData ? 'Update auditor information' : 'Add a new auditor to the system'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-3 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0 border-2 border-transparent hover:border-red-200"
          style={{ backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 226, 226, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(254, 226, 226, 0.5)'}
        >
          <X className="w-6 h-6 text-red-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-3" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
              style={{ borderColor: '#E0F7F4', fontSize: '0.95rem' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0AAE9A';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E0F7F4';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-3" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
              style={{ borderColor: '#E0F7F4', fontSize: '0.95rem' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0AAE9A';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E0F7F4';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
              placeholder="auditor@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-3" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '0.95rem' }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm bg-white/50"
              style={{ borderColor: '#E0F7F4', fontSize: '0.95rem' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0AAE9A';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(10, 174, 154, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E0F7F4';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="p-7 rounded-2xl w-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(224, 247, 244, 0.4)', border: '2px dashed #B8F1E8' }}>
          <label className="block mb-5 m-0 flex items-center gap-2" style={{ color: '#0AAE9A', fontWeight: '600', fontSize: '1rem' }}>
            <MapPin className="w-5 h-5" />
            Circles to be Covered *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CIRCLES.map((circle) => (
              <label
                key={circle}
                className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-sm"
                style={{
                  borderColor: formData.circles.includes(circle) ? '#0AAE9A' : '#E0F7F4',
                  backgroundColor: formData.circles.includes(circle) ? '#E0F7F4' : 'white'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.circles.includes(circle)}
                  onChange={() => toggleCircle(circle)}
                  className="w-5 h-5 rounded flex-shrink-0"
                  style={{ accentColor: '#0AAE9A' }}
                />
                <span className="text-sm" style={{ color: '#0AAE9A', fontWeight: '600' }}>{circle}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={formData.circles.length === 0}
            className="flex-1 px-8 py-4 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(10,174,154,0.3)] hover:shadow-[0_15px_40px_rgba(10,174,154,0.4)] relative overflow-hidden group"
            style={{
              background: formData.circles.length === 0 
                ? '#B8F1E8' 
                : 'linear-gradient(135deg, #0AAE9A 0%, #078672 50%, #0AAE9A 100%)',
              backgroundSize: '200% 100%',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (formData.circles.length > 0) {
                e.currentTarget.style.backgroundPosition = '100% 0';
              }
            }}
            onMouseLeave={(e) => {
              if (formData.circles.length > 0) {
                e.currentTarget.style.backgroundPosition = '0% 0';
              }
            }}
          >
            <span className="relative z-10">{initialData ? 'Update Auditor' : 'Create Auditor'}</span>
            {formData.circles.length > 0 && (
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-sm"
            style={{ borderColor: '#0AAE9A', color: '#078672', backgroundColor: 'white', fontWeight: '600' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E0F7F4';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
