import React, { useState, useEffect } from 'react';
import { getCropsByDistrict, getCrops } from '../../services/smartKrishiService';
import { Sprout } from 'lucide-react';

const CropDropdown = ({ value, onChange, district }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (district === undefined) {
      setLoading(true);
      setErrorMsg('');
      getCrops()
        .then(res => {
          if (res && res.success) {
            const list = res.data || [];
            setCrops(list.map(c => c.name || c) || []);
          } else {
            setCrops([]);
            setErrorMsg('Failed to load crops.');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load all crops:', err);
          setCrops([]);
          setErrorMsg('Failed to load crops.');
          setLoading(false);
        });
      return;
    }

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
          setCrops(fetchedCrops);
          if (fetchedCrops.length === 0) {
            setErrorMsg('No suitable crops found for this district.');
          }
        } else {
          setCrops([]);
          setErrorMsg('No suitable crops found for this district.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load crops for district:', err);
        setCrops([]);
        setErrorMsg('No suitable crops found for this district.');
        setLoading(false);
      });
  }, [district]);

  const isDisabled = (district !== undefined && !district) || loading;

  const getPlaceholderText = () => {
    if (district === undefined) return "Select Crop";
    if (!district) return "Select District first";
    if (loading) return "Loading suitable crops...";
    if (crops.length === 0) return "No suitable crops found";
    return "Select Crop";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: '220px' }}>
      <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-secondary, #475569)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sprout size={18} style={{ color: '#166534' }} />
        <span>Target Crop</span>
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-emerald-600 shadow-sm"
      >
        <option value="">{getPlaceholderText()}</option>
        {crops.map((c, idx) => (
          <option key={idx} value={c}>{c}</option>
        ))}
      </select>
      {errorMsg && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', margin: '2px 0 0 0' }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default CropDropdown;
