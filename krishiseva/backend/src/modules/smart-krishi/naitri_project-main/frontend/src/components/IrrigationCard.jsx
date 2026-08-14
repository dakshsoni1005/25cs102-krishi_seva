import React, { useContext } from 'react';
import { Droplet, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const IrrigationCard = ({ irrigation }) => {
  const { lang } = useContext(LanguageContext);
  if (!irrigation || irrigation === 'N/A') return null;

  const { frequency, waterRequirement } = irrigation;

  const getTipText = () => {
    if (lang === 'hi') {
      return "वास्तविक दैनिक बारिश की स्थिति के आधार पर पानी की मात्रा को समायोजित करें। यदि बारिश की संभावना 70% से अधिक है तो सिंचाई न करें।";
    }
    if (lang === 'gj') {
      return "દૈનિક વરસાદની સ્થિતિને આધારે પાણીની જરૂરિયાત ગોઠવો. જો વરસાદની સંભાવના 70% થી વધુ હોય તો સિંચાઈ મુલતવી રાખો.";
    }
    return "Adjust water depths based on actual daily rain conditions. Skip scheduled irrigation if rainfall probability is forecast above 70%.";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel hover-lift" 
      style={{ height: '100%', border: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Droplet size={22} style={{ color: '#3b82f6' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'irrigationTitle')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--neutral-100)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-inner)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              {getTranslation(lang, 'irrigationFreq')}
            </span>
            <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-primary)' }}>{frequency || 'N/A'}</span>
          </div>
          <div style={{ backgroundColor: 'var(--neutral-100)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-inner)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              {getTranslation(lang, 'irrigationDepth')}
            </span>
            <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-primary)' }}>{waterRequirement || 'N/A'}</span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.04)',
          border: '1px dashed rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          lineHeight: '1.6',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <Info size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
          <span>
            {getTipText()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default IrrigationCard;
