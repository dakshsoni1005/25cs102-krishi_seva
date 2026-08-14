import React, { useContext } from 'react';
import { Cpu, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const AIRecommendationCard = ({ recommendation }) => {
  const { lang } = useContext(LanguageContext);
  if (!recommendation) return null;

  const { summary, dos, donts, warnings } = recommendation;

  const getTitleText = () => {
    if (lang === 'hi') return "जेमिनी एआई स्मार्ट सलाहकार सिफारिशें";
    if (lang === 'gj') return "જેમિની AI સ્માર્ટ સલાહકાર ભલામણો";
    return "Gemini AI Smart Advisor Recommendations";
  };

  const getDosTitle = () => {
    if (lang === 'hi') return "अनुशंसित कार्य (करें)";
    if (lang === 'gj') return "ભલામણ કરેલ કાર્યો (કરો)";
    return "Recommended (Do's)";
  };

  const getDontsTitle = () => {
    if (lang === 'hi') return "सावधानियां (न करें)";
    if (lang === 'gj') return "સાવચેતીઓ (ન કરો)";
    return "Precautions (Don'ts)";
  };

  const getWarningsTitle = () => {
    if (lang === 'hi') return "महत्वपूर्ण खतरे";
    if (lang === 'gj') return "ગંભીર જોખમો";
    return "Critical Hazards";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
      className="glass-panel" 
      style={{
        gridColumn: 'span 12',
        borderLeft: '6px solid var(--primary)',
        background: 'linear-gradient(135deg, var(--glass-bg) 0%, rgba(34, 197, 94, 0.03) 100%)',
        boxShadow: 'var(--shadow-md), var(--glow-shadow)'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          padding: '10px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Cpu size={24} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.015em', margin: 0 }}>
          {getTitleText()}
        </h3>
      </div>

      {/* Summary Box */}
      <div style={{
        backgroundColor: 'var(--neutral-100)',
        border: '1px solid var(--border-inner)',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        fontSize: '1.02rem',
        fontWeight: '500',
        lineHeight: '1.7',
        color: 'var(--text-primary)',
        marginBottom: '32px',
        borderLeft: '4px solid var(--accent)'
      }}>
        {getTranslation(lang, summary)}
      </div>

      {/* Grid of lists */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '28px'
      }}>
        {/* Do's List */}
        {dos && dos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>
              <CheckCircle2 size={20} />
              <span>{getDosTitle()}</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dos.map((item, idx) => (
                <li key={idx} style={{
                  fontSize: '0.92rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  padding: '12px 16px',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.5'
                }}>
                  {getTranslation(lang, item)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dont's List */}
        {donts && donts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>
              <XCircle size={20} />
              <span>{getDontsTitle()}</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {donts.map((item, idx) => (
                <li key={idx} style={{
                  fontSize: '0.92rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  padding: '12px 16px',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.5'
                }}>
                  {getTranslation(lang, item)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings List */}
        {warnings && warnings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>
              <AlertTriangle size={20} />
              <span>{getWarningsTitle()}</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {warnings.map((item, idx) => (
                <li key={idx} style={{
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  color: '#ef4444',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.5'
                }}>
                  {getTranslation(lang, item)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIRecommendationCard;
