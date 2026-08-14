import React, { useState, useEffect, useContext } from 'react';
import { getDistricts } from '../services/api';
import { MapPin } from 'lucide-react';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const DistrictDropdown = ({ value, onChange }) => {
  const { lang } = useContext(LanguageContext);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistricts()
      .then(res => {
        if (res && res.success) {
          setDistricts(res.data || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load districts:', err);
        setLoading(false);
      });
  }, []);

  const getLabelText = () => {
    if (lang === 'hi') return "जिला";
    if (lang === 'gj') return "જિલ્લો";
    return "District";
  };

  const getPlaceholderText = () => {
    if (loading) {
      if (lang === 'hi') return "जिले लोड हो रहे हैं...";
      if (lang === 'gj') return "જિલ્લાઓ લોડ થઈ રહ્યા છે...";
      return "Loading districts...";
    }
    return getTranslation(lang, 'formStep1');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '240px' }}>
      <label style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={18} style={{ color: 'var(--primary-light)' }} />
        <span>{getLabelText()}</span>
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        style={{
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="">{getPlaceholderText()}</option>
        {districts.map(d => (
          <option key={d._id} value={d.name}>{getTranslation(lang, d.name)}</option>
        ))}
      </select>
    </div>
  );
};

export default DistrictDropdown;
