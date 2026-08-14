import React, { useState } from 'react';
import DistrictDropdown from './DistrictDropdown';
import CropDropdown from './CropDropdown';
import SeasonDropdown from './SeasonDropdown';
import { Send, Sparkles } from 'lucide-react';

const RecommendationForm = ({ onSubmit }) => {
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('Kharif');
  const [error, setError] = useState('');

  const handleDistrictChange = (val) => {
    setDistrict(val);
    setCrop('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!district || !crop) {
      setError('Please select both a Target District and a Target Crop.');
      return;
    }
    setError('');
    onSubmit({ district, crop, season });
  };

  const activeStep = !district ? 1 : !crop ? 2 : 3;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto mb-10 transition-all"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <Sparkles className="w-5 h-5 text-emerald-700" />
        <h3 className="text-xl font-extrabold text-slate-900 m-0 tracking-tight">
          Agricultural Decision Engine Query
        </h3>
      </div>
      <p className="text-xs md:text-sm text-slate-500 mb-8 font-medium">
        Select your target district, crop, and season parameters to generate action-oriented field advisories.
      </p>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0">
          <div 
            style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
            className="h-full bg-emerald-600 transition-all duration-300"
          />
        </div>

        {[
          { step: 1, label: 'Target District' },
          { step: 2, label: 'Cultivated Crop' },
          { step: 3, label: 'Cropping Season' }
        ].map((item) => {
          const isCompleted = activeStep > item.step;
          const isActive = activeStep === item.step;
          return (
            <div key={item.step} className="flex flex-col items-center z-10 flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs border-2 transition-all ${
                  isCompleted || isActive
                    ? "bg-emerald-800 border-emerald-800 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {item.step}
              </div>
              <span className={`text-xs mt-2 font-bold ${isActive ? "text-emerald-900 font-extrabold" : "text-slate-400"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selectors Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <DistrictDropdown value={district} onChange={handleDistrictChange} />
        <CropDropdown value={crop} onChange={setCrop} district={district} />
        <SeasonDropdown value={season} onChange={setSeason} />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs font-bold text-rose-600 mb-4 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {/* Submit Button */}
      <div className="flex justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider uppercase px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <span>Evaluate Decision Engine</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default RecommendationForm;
