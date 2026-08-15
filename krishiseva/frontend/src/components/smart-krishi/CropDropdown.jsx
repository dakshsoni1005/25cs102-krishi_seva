import React, { useState, useEffect } from 'react';
import { getCropsByDistrict, getCrops } from '../../services/smartKrishiService';
import { Sprout } from 'lucide-react';

const FALLBACK_DISTRICT_CROP_MAP = {
  "Rajkot": ["Cotton", "Groundnut", "Wheat", "Bajra", "Sesame", "Castor"],
  "Amreli": ["Groundnut", "Cotton", "Sesame", "Bajra", "Wheat"],
  "Bhavnagar": ["Cotton", "Groundnut", "Wheat", "Bajra", "Sesame"],
  "Jamnagar": ["Groundnut", "Cotton", "Wheat", "Castor", "Sesame"],
  "Junagadh": ["Groundnut", "Cotton", "Wheat", "Sesame", "Bajra"],
  "Morbi": ["Cotton", "Groundnut", "Sesame", "Castor", "Wheat"],
  "Porbandar": ["Groundnut", "Cotton", "Wheat", "Sesame"],
  "Surendranagar": ["Cotton", "Sesame", "Bajra", "Wheat", "Groundnut"],
  "Botad": ["Cotton", "Groundnut", "Wheat", "Sesame"],
  "Devbhoomi Dwarka": ["Groundnut", "Cotton", "Wheat", "Sesame"],
  "Gir Somnath": ["Groundnut", "Cotton", "Wheat", "Sugarcane", "Sesame"],

  "Anand": ["Tobacco", "Paddy", "Wheat", "Cotton", "Groundnut", "Castor"],
  "Kheda": ["Paddy", "Tobacco", "Wheat", "Cotton", "Castor", "Mustard"],
  "Ahmedabad": ["Cotton", "Wheat", "Paddy", "Castor", "Bajra", "Mustard"],
  "Vadodara": ["Cotton", "Paddy", "Wheat", "Sugarcane", "Castor"],
  "Panchmahal": ["Paddy", "Wheat", "Cotton", "Castor", "Groundnut"],
  "Dahod": ["Paddy", "Wheat", "Cotton", "Groundnut"],
  "Mahisagar": ["Paddy", "Wheat", "Tobacco", "Cotton"],
  "Chhota Udepur": ["Cotton", "Paddy", "Groundnut", "Wheat"],

  "Banaskantha": ["Mustard", "Bajra", "Castor", "Groundnut", "Wheat"],
  "Patan": ["Mustard", "Bajra", "Castor", "Wheat", "Cotton", "Sesame"],
  "Mehsana": ["Mustard", "Tobacco", "Castor", "Wheat", "Cotton", "Bajra"],
  "Sabarkantha": ["Cotton", "Groundnut", "Wheat", "Castor"],
  "Gandhinagar": ["Wheat", "Cotton", "Castor", "Paddy", "Mustard"],
  "Aravalli": ["Cotton", "Groundnut", "Wheat", "Castor"],

  "Surat": ["Sugarcane", "Paddy", "Cotton", "Wheat"],
  "Navsari": ["Paddy", "Sugarcane", "Wheat"],
  "Valsad": ["Paddy", "Sugarcane", "Wheat"],
  "Bharuch": ["Cotton", "Paddy", "Wheat", "Sugarcane", "Castor"],
  "Narmada": ["Cotton", "Paddy", "Sugarcane", "Wheat"],
  "Tapi": ["Paddy", "Sugarcane", "Cotton", "Wheat"],
  "Dang": ["Paddy", "Groundnut", "Wheat"],

  "Kachchh": ["Castor", "Bajra", "Groundnut", "Cotton", "Mustard", "Sesame"]
};

const DEFAULT_CROPS = ["Cotton", "Groundnut", "Wheat", "Bajra", "Castor", "Sesame"];

const CropDropdown = ({ value, onChange, district }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getFallbackCrops = (d) => {
    if (!d) return DEFAULT_CROPS;
    const matchKey = Object.keys(FALLBACK_DISTRICT_CROP_MAP).find(
      k => k.toLowerCase() === d.toLowerCase()
    );
    return matchKey ? FALLBACK_DISTRICT_CROP_MAP[matchKey] : DEFAULT_CROPS;
  };

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
            setCrops(DEFAULT_CROPS);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load all crops:', err);
          setCrops(DEFAULT_CROPS);
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
        let fetchedCrops = [];
        if (res && Array.isArray(res.crops)) {
          fetchedCrops = res.crops;
        } else if (res && Array.isArray(res.data)) {
          fetchedCrops = res.data.map(c => c.name || c);
        } else if (Array.isArray(res)) {
          fetchedCrops = res.map(c => c.name || c);
        }

        if (fetchedCrops.length === 0) {
          fetchedCrops = getFallbackCrops(district);
        }

        setCrops(fetchedCrops);
        setErrorMsg('');
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load crops for district:', err);
        const fb = getFallbackCrops(district);
        setCrops(fb);
        setErrorMsg('');
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
