import React, { useContext } from 'react';
import { Cpu, Database, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const About = () => {
  const { lang } = useContext(LanguageContext);

  return (
    <div className="container" style={{ padding: '40px 0 80px 0', maxWidth: '850px', position: 'relative' }}>
      {/* Background Mesh Glows */}
      <div className="mesh-glow-container">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
        <div className="mesh-glow-3"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '14px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {lang === 'hi' ? 'स्मार्ट कृषि हमारे बारे में' : lang === 'gj' ? 'સ્માર્ટ કૃષિ વિશે' : 'About Smart Krishi'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.6' }}>
          {getTranslation(lang, 'aboutSubtitle')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-panel" 
        style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', border: '1px solid var(--border)' }}
      >
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500', lineHeight: '1.7', margin: 0 }}>
          {getTranslation(lang, 'aboutBody')}
        </p>

        <h3 style={{ fontSize: '1.45rem', fontWeight: '800', borderBottom: '1px solid var(--border-inner)', paddingBottom: '14px', color: 'var(--primary)', margin: 0, letterSpacing: '-0.01em' }}>
          {getTranslation(lang, 'aboutArchTitle')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(34, 197, 94, 0.08)', 
              borderRadius: '16px', 
              color: 'var(--primary-light)', 
              alignSelf: 'flex-start',
              display: 'flex'
            }}>
              <Database size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {getTranslation(lang, 'aboutSec1Title')}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>
                {getTranslation(lang, 'aboutSec1Desc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(59, 130, 246, 0.08)', 
              borderRadius: '16px', 
              color: '#3b82f6', 
              alignSelf: 'flex-start',
              display: 'flex'
            }}>
              <Cpu size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {getTranslation(lang, 'aboutSec2Title')}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>
                {getTranslation(lang, 'aboutSec2Desc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(168, 85, 247, 0.08)', 
              borderRadius: '16px', 
              color: '#a855f7', 
              alignSelf: 'flex-start',
              display: 'flex'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {getTranslation(lang, 'aboutSec3Title')}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>
                {getTranslation(lang, 'aboutSec3Desc')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
