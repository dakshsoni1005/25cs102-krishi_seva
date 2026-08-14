import React, { useContext } from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const AdvisoryCard = ({ advisories }) => {
  const { lang } = useContext(LanguageContext);
  if (!advisories || !advisories.length) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel" 
      style={{ gridColumn: 'span 12', border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle size={22} style={{ color: 'var(--secondary)' }} />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'advisoryTitle')}
        </h3>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid-cols-12"
      >
        {advisories.map((adv, index) => {
          const isCritical = adv.level === 'Critical' || adv.level === 'High';
          
          return (
            <motion.div 
              variants={item}
              key={index} 
              className="col-span-4"
              style={{
                display: 'flex',
                gap: '14px',
                padding: '20px',
                backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.03)' : 'var(--neutral-100)',
                border: isCritical ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid var(--border-inner)',
                borderLeft: isCritical ? '4px solid #ef4444' : '4px solid var(--primary-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ShieldAlert 
                size={20} 
                style={{ 
                  color: isCritical ? '#ef4444' : 'var(--primary-light)', 
                  flexShrink: 0,
                  marginTop: '2px'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={`badge ${isCritical ? 'badge-red' : 'badge-green'}`} style={{ alignSelf: 'flex-start', fontSize: '0.68rem', padding: '2px 8px' }}>
                  {getTranslation(lang, adv.type)} • {getTranslation(lang, adv.level || 'Low')}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {getTranslation(lang, adv.message)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default AdvisoryCard;
