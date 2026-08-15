import React, { useState, useEffect } from 'react';
import { getDistricts } from '../../services/smartKrishiService';
import { MapPin } from 'lucide-react';

const DEFAULT_GUJARAT_DISTRICTS = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", 
  "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", 
  "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana", 
  "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", 
  "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
];

const DistrictDropdown = ({ value, onChange }) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistricts()
      .then(res => {
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.data)) {
          list = res.data;
        } else if (res && Array.isArray(res.districts)) {
          list = res.districts;
        }
        
        if (list.length > 0) {
          setDistricts(list);
        } else {
          setDistricts(DEFAULT_GUJARAT_DISTRICTS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load districts:', err);
        setDistricts(DEFAULT_GUJARAT_DISTRICTS);
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
