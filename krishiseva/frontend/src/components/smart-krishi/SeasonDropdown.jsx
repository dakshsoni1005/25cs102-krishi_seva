import React from 'react';
import { Sun } from 'lucide-react';

const SeasonDropdown = ({ value, onChange }) => {
  const seasons = [
    { value: 'Kharif', label: 'Kharif (Monsoon Season)' },
    { value: 'Rabi', label: 'Rabi (Winter Season)' },
    { value: 'Zaid', label: 'Zaid (Summer Season)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: '220px' }}>
      <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-secondary, #475569)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sun size={18} style={{ color: '#166534' }} />
        <span>Cropping Season</span>
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
      >
        {seasons.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SeasonDropdown;
