import React, { useContext } from 'react';
import { Leaf, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const FertilizerCard = ({ fertilizers }) => {
  const { lang } = useContext(LanguageContext);
  if (!fertilizers || !fertilizers.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
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
          <Leaf size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'fertilizerTitle')}
        </h3>
      </div>

      {/* Chronological Timeline */}
      <div className="timeline">
        {fertilizers.map((fert, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker" />
            <div className="glass-panel" style={{
              padding: '16px 20px',
              border: '1px solid var(--border-inner)',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarDays size={12} />
                  <span>{getTranslation(lang, fert.stage)} {lang === 'en' ? 'Stage' : lang === 'hi' ? 'चरण' : 'તબક્કો'}</span>
                </span>
                <span style={{ fontWeight: '800', color: 'var(--primary-light)', fontSize: '0.98rem' }}>
                  {getTranslation(lang, fert.quantity)}
                </span>
              </div>
              <h4 style={{ fontWeight: '700', fontSize: '1.02rem', color: 'var(--text-primary)', margin: 0 }}>
                {getTranslation(lang, fert.name)}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FertilizerCard;
