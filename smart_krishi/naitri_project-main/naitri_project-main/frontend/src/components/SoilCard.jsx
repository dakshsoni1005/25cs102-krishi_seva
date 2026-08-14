import React, { useContext } from 'react';
import { Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const SoilCard = ({ soil }) => {
  const { lang } = useContext(LanguageContext);
  if (!soil || soil === 'N/A') return null;

  const { type, texture, ph, npk } = soil;

  // Extract pH value as float to render gauge
  const phVal = parseFloat(ph) || 7.0;
  // Map pH to progress stroke-dashoffset (assume pH range 0 to 14, circumference of circle = 2 * PI * r = 2 * 3.14 * 24 = 150.72)
  const strokeOffset = 150.72 - (phVal / 14) * 150.72;

  const getNutrientBg = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('high')) return 'var(--primary)';
    if (s.includes('medium') || s.includes('moderate')) return 'var(--secondary)';
    return '#ef4444';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel hover-lift" 
      style={{ height: '100%', border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Database size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'soilTitle')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              {getTranslation(lang, 'soilType')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {getTranslation(lang, type) || 'N/A'}
            </span>
            
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginTop: '12px', marginBottom: '4px' }}>
              {getTranslation(lang, 'soilTexture')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {getTranslation(lang, texture) || 'N/A'}
            </span>
          </div>

          {/* Circular pH Gauge */}
          <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '70px', height: '70px' }}>
              <circle cx="35" cy="35" r="24" fill="transparent" stroke="var(--neutral-200)" strokeWidth="6" />
              <motion.circle 
                cx="35" 
                cy="35" 
                r="24" 
                fill="transparent" 
                stroke="var(--accent)" 
                strokeWidth="6" 
                strokeDasharray="150.72"
                initial={{ strokeDashoffset: 150.72 }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>{phVal}</span>
              <span style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>pH</span>
            </div>
          </div>
        </div>

        {npk && (
          <div style={{ marginTop: '4px', borderTop: '1px solid var(--border-inner)', paddingTop: '20px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
              {getTranslation(lang, 'soilNPK')}
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Nitrogen */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'en' ? 'Nitrogen (N)' : lang === 'hi' ? 'नाइट्रोजन (N)' : 'નાઇટ્રોજન (N)'}</span>
                  <span style={{ color: getNutrientBg(npk.nitrogen) }}>{getTranslation(lang, npk.nitrogen)}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--neutral-200)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: npk.nitrogen?.toLowerCase().includes('high') ? '100%' : npk.nitrogen?.toLowerCase().includes('medium') ? '60%' : '30%' }}
                    transition={{ duration: 0.8 }}
                    style={{ height: '100%', backgroundColor: getNutrientBg(npk.nitrogen), borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* Phosphorus */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'en' ? 'Phosphorus (P)' : lang === 'hi' ? 'फास्फोरस (P)' : 'ફોસ્ફરસ (P)'}</span>
                  <span style={{ color: getNutrientBg(npk.phosphorus) }}>{getTranslation(lang, npk.phosphorus)}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--neutral-200)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: npk.phosphorus?.toLowerCase().includes('high') ? '100%' : npk.phosphorus?.toLowerCase().includes('medium') ? '60%' : '30%' }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    style={{ height: '100%', backgroundColor: getNutrientBg(npk.phosphorus), borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* Potassium */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'en' ? 'Potassium (K)' : lang === 'hi' ? 'पोटैशियम (K)' : 'પોટેશિયમ (K)'}</span>
                  <span style={{ color: getNutrientBg(npk.potassium) }}>{getTranslation(lang, npk.potassium)}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--neutral-200)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: npk.potassium?.toLowerCase().includes('high') ? '100%' : npk.potassium?.toLowerCase().includes('medium') ? '60%' : '30%' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ height: '100%', backgroundColor: getNutrientBg(npk.potassium), borderRadius: '10px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SoilCard;
