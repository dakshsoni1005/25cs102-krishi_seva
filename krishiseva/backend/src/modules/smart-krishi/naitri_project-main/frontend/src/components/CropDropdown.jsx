import React, { useState, useEffect, useContext } from 'react';
import { getCropsByDistrict, getCrops } from '../services/api';
import { Sprout } from 'lucide-react';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const CropDropdown = ({ value, onChange, district }) => {
  const { lang } = useContext(LanguageContext);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If district is undefined (not passed as a prop, e.g. on Market page), load all crops
    if (district === undefined) {
      setLoading(true);
      setErrorMsg('');
      getCrops()
        .then(res => {
          if (res && res.success) {
            const list = res.data || [];
            setCrops(list.map(c => c.name) || []);
          } else {
            setCrops([]);
            setErrorMsg(lang === 'hi' ? 'फसलें लोड करने में विफल।' : lang === 'gj' ? 'પાકો લોડ કરવામાં નિષ્ફળ.' : 'Failed to load crops.');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load all crops:', err);
          setCrops([]);
          setErrorMsg(lang === 'hi' ? 'फसलें लोड करने में विफल।' : lang === 'gj' ? 'પાકો લોડ કરવામાં નિષ્ફળ.' : 'Failed to load crops.');
          setLoading(false);
        });
      return;
    }

    console.log('Selected District:', district);
    if (!district) {
      setCrops([]);
      setErrorMsg('');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    getCropsByDistrict(district)
      .then(res => {
        if (res && res.success) {
          const fetchedCrops = res.crops || [];
          console.log('Returned suitable crops:', fetchedCrops);
          setCrops(fetchedCrops);
          if (fetchedCrops.length === 0) {
            setErrorMsg(lang === 'hi' ? 'इस जिले के लिए कोई उपयुक्त फसल नहीं मिली।' : lang === 'gj' ? 'આ જિલ્લા માટે કોઈ યોગ્ય પાક મળ્યો નથી.' : 'No suitable crops found for this district.');
          }
        } else {
          setCrops([]);
          setErrorMsg(lang === 'hi' ? 'इस जिले के लिए कोई उपयुक्त फसल नहीं मिली।' : lang === 'gj' ? 'આ જિલ્લા માટે કોઈ યોગ્ય પાક મળ્યો નથી.' : 'No suitable crops found for this district.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load crops for district:', err);
        setCrops([]);
        setErrorMsg(lang === 'hi' ? 'इस जिले के लिए कोई उपयुक्त फसल नहीं मिली।' : lang === 'gj' ? 'આ જિલ્લા માટે કોઈ યોગ્ય પાક મળ્યો નથી.' : 'No suitable crops found for this district.');
        setLoading(false);
      });
  }, [district, lang]);

  const isDisabled = (district !== undefined && !district) || loading;

  const getLabelText = () => {
    if (lang === 'hi') return "फसल";
    if (lang === 'gj') return "પાક";
    return "Crop";
  };

  const getPlaceholderText = () => {
    if (district === undefined) {
      return getTranslation(lang, 'formStep2');
    }
    if (!district) {
      if (lang === 'hi') return "पहले जिला चुनें";
      if (lang === 'gj') return "પહેલા જિલ્લો પસંદ કરો";
      return "Select District first";
    }
    if (loading) {
      if (lang === 'hi') return "लोड हो रहा है...";
      if (lang === 'gj') return "લોડ થઈ રહ્યું છે...";
      return "Loading crops...";
    }
    if (crops.length === 0) {
      if (lang === 'hi') return "कोई उपयुक्त फसल नहीं मिली";
      if (lang === 'gj') return "કોઈ યોગ્ય પાક મળ્યો નથી";
      return "No suitable crops found";
    }
    return getTranslation(lang, 'formStep2');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1', minWidth: '240px' }}>
      <label style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sprout size={18} style={{ color: 'var(--primary-light)' }} />
        <span>{getLabelText()}</span>
        {loading && <span className="spinner" style={{ marginLeft: '4px' }} />}
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        style={{
          cursor: isDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="">{getPlaceholderText()}</option>
        {crops.map((c, idx) => (
          <option key={idx} value={c}>{getTranslation(lang, c)}</option>
        ))}
      </select>
      {errorMsg && (
        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', fontWeight: '600', margin: '0' }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default CropDropdown;
