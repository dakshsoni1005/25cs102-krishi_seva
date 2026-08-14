import React, { useContext } from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const PestCard = ({ pests }) => {
  const { lang } = useContext(LanguageContext);
  if (!pests || !pests.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel" 
      style={{ height: '100%', border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={22} style={{ color: '#ef4444' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'pestTitle')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {pests.map((pest, index) => {
          const isHighRisk = String(pest.risk || '').toLowerCase() === 'high';
          return (
            <div key={index} style={{
              borderBottom: index !== pests.length - 1 ? '1px solid var(--border-inner)' : 'none',
              paddingBottom: index !== pests.length - 1 ? '18px' : '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <h4 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>
                  {getTranslation(lang, pest.name)}
                </h4>
                {pest.risk && (
                  <span className={`badge ${isHighRisk ? 'badge-red' : 'badge-gold'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {getTranslation(lang, pest.risk)} {lang === 'en' ? 'Threat' : lang === 'hi' ? 'जोखिम' : 'જોખમ'}
                  </span>
                )}
              </div>
              <div style={{
                backgroundColor: 'var(--neutral-100)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid #ef4444',
                border: '1px solid var(--border-inner)'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#ef4444', display: 'block', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {getTranslation(lang, 'pestControl')}
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.5' }}>
                  {getTranslation(lang, pest.solution)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PestCard;
