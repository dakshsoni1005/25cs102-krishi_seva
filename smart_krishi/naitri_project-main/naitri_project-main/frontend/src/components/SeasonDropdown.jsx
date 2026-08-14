import React, { useContext } from 'react';
import { Calendar } from 'lucide-react';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const SeasonDropdown = ({ value, onChange }) => {
  const { lang } = useContext(LanguageContext);

  const getLabelText = () => {
    if (lang === 'hi') return "मौसम (ऋतु)";
    if (lang === 'gj') return "ઋતુ";
    return "Season";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '240px' }}>
      <label style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Calendar size={18} style={{ color: 'var(--primary-light)' }} />
        <span>{getLabelText()}</span>
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{
          cursor: 'pointer'
        }}
      >
        <option value="Kharif">{lang === 'hi' ? 'खरीफ (मानसून)' : lang === 'gj' ? 'ખરીફ (ચોમાસું)' : 'Kharif (Monsoon)'}</option>
        <option value="Rabi">{lang === 'hi' ? 'रबी (सर्दियों)' : lang === 'gj' ? 'રવિ (શિયાળો)' : 'Rabi (Winter)'}</option>
        <option value="Summer">{lang === 'hi' ? 'जायद (गर्मी)' : lang === 'gj' ? 'ઉનાળુ (ગરમી)' : 'Summer (Zaid)'}</option>
      </select>
    </div>
  );
};

export default SeasonDropdown;
