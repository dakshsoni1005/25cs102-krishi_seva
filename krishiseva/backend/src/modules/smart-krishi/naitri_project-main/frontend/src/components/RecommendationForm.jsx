import React, { useState, useContext } from 'react';
import DistrictDropdown from './DistrictDropdown';
import CropDropdown from './CropDropdown';
import SeasonDropdown from './SeasonDropdown';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const RecommendationForm = ({ onSubmit }) => {
  const { lang } = useContext(LanguageContext);
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
      setError(lang === 'en' ? 'Please select both a District and a Crop.' : lang === 'hi' ? 'कृपया जिला और फसल दोनों का चयन करें।' : 'કૃપા કરીને જિલ્લો અને પાક બંને પસંદ કરો.');
      return;
    }
    setError('');
    onSubmit({ district, crop, season });
  };

  // Determine current active step for the visual progress bar
  const activeStep = !district ? 1 : !crop ? 2 : 3;

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={handleSubmit} 
      className="glass-panel" 
      style={{
        maxWidth: '900px',
        margin: '0 auto 48px auto',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Sparkles size={20} style={{ color: 'var(--primary-light)' }} />
        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
          {getTranslation(lang, 'formTitle')}
        </h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '32px' }}>
        {getTranslation(lang, 'formSubtitle')}
      </p>

      {/* Step Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', position: 'relative' }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '8%',
          right: '8%',
          height: '2px',
          backgroundColor: 'var(--border-inner)',
          zIndex: 0
        }}>
          <motion.div 
            animate={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary-light), var(--accent))'
            }}
          />
        </div>

        {/* Step Items */}
        {[
          { step: 1, label: getTranslation(lang, 'formStep1') },
          { step: 2, label: getTranslation(lang, 'formStep2') },
          { step: 3, label: getTranslation(lang, 'formStep3') }
        ].map((item) => {
          const isCompleted = activeStep > item.step;
          const isActive = activeStep === item.step;
          return (
            <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
              <motion.div 
                animate={{
                  backgroundColor: isCompleted || isActive ? 'var(--primary)' : 'var(--background)',
                  color: isCompleted || isActive ? '#fff' : 'var(--text-muted)',
                  borderColor: isCompleted || isActive ? 'var(--primary-light)' : 'var(--border)'
                }}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  border: '2px solid var(--border)',
                  boxShadow: isActive ? 'var(--glow-shadow)' : 'none',
                  transition: 'all var(--transition-normal)'
                }}
              >
                {item.step}
              </motion.div>
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: isActive ? '700' : '600', 
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                marginTop: '8px',
                textAlign: 'center'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selectors Group */}
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        marginBottom: '32px'
      }}>
        <DistrictDropdown value={district} onChange={handleDistrictChange} />
        <CropDropdown value={crop} onChange={setCrop} district={district} />
        <SeasonDropdown value={season} onChange={setSeason} />
      </div>

      {/* Validation Warning */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.p>
      )}

      {/* Submit Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-inner)', paddingTop: '24px' }}>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px' }}>
            <span>{getTranslation(lang, 'formSubmit')}</span>
            <Send size={16} />
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default RecommendationForm;
