import React, { useState, useEffect } from 'react';
import { getDistricts } from '../../services/smartKrishiService';
import { MapPin } from 'lucide-react';

const DistrictDropdown = ({ value, onChange }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistricts()
      .then(res => {
        if (res && res.success) {
          setDistricts(res.data || []);
        } else if (Array.isArray(res)) {
          setDistricts(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load districts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: '220px' }}>
      <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-secondary, #475569)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={18} style={{ color: '#166534' }} />
        <span>Target District</span>
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-emerald-600 shadow-sm"
      >
        <option value="">{loading ? "Loading districts..." : "Select District"}</option>
        {districts.map((d, idx) => (
          <option key={d._id || idx} value={d.name || d}>{d.name || d}</option>
        ))}
      </select>
    </div>
  );
};

export default DistrictDropdown;
