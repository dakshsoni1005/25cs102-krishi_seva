import React, { useContext } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const DiseaseCard = ({ diseases }) => {
  const { lang } = useContext(LanguageContext);
  if (!diseases || !diseases.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-panel hover-lift" 
      style={{ height: '100%', border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={22} style={{ color: 'var(--secondary)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'diseaseTitle')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {diseases.map((disease, index) => {
          const isHighRisk = String(disease.risk || '').toLowerCase() === 'high';
          const symptomsText = Array.isArray(disease.symptoms) ? disease.symptoms.join(', ') : disease.symptoms;
          
          return (
            <div key={index} style={{
              borderBottom: index !== diseases.length - 1 ? '1px solid var(--border-inner)' : 'none',
              paddingBottom: index !== diseases.length - 1 ? '18px' : '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <h4 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>
                  {getTranslation(lang, disease.name)}
                </h4>
                {disease.risk && (
                  <span className={`badge ${isHighRisk ? 'badge-red' : 'badge-gold'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {getTranslation(lang, disease.risk)} {lang === 'en' ? 'Risk' : lang === 'hi' ? 'जोखिम' : 'જોખમ'}
                  </span>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {getTranslation(lang, 'diseaseSymptoms')}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {getTranslation(lang, symptomsText)}
                </span>
              </div>

              <div style={{
                backgroundColor: 'var(--neutral-100)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--primary-light)'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', display: 'block', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {getTranslation(lang, 'diseaseCure')}
                </span>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.5' }}>
                  {getTranslation(lang, disease.solution)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DiseaseCard;
