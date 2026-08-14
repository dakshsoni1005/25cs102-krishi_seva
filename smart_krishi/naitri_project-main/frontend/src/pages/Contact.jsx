import React, { useContext } from 'react';
import { PhoneCall, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Contact = () => {
  const { lang } = useContext(LanguageContext);

  const helplines = [
    {
      name: "Kisan Call Centre (KCC)",
      number: "1800-180-1551",
      desc: "Toll-free agricultural query helpline operated by the Ministry of Agriculture."
    },
    {
      name: "Gujarat Krishi Mahotsav Helpline",
      number: "1800-233-5500",
      desc: "State-sponsored advisory helpline for localized crop information."
    }
  ];

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
          {lang === 'hi' ? 'कृषि संपर्क हेल्पलाइन' : lang === 'gj' ? 'કૃષિ સંપર્ક હેલ્પલાઇન' : 'Agricultural Helpline & Contact'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.6' }}>
          {getTranslation(lang, 'contactSubtitle')}
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Helplines List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-panel" 
          style={{ padding: '40px', border: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px', borderBottom: '1px solid var(--border-inner)', paddingBottom: '14px' }}>
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <PhoneCall size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {getTranslation(lang, 'contactTollFree')}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {helplines.map((hp, idx) => (
              <div key={idx} style={{
                padding: '20px',
                backgroundColor: 'var(--neutral-100)',
                border: '1px solid var(--border-inner)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)'
              }} className="hover-lift">
                <h4 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {getTranslation(lang, hp.name)}
                </h4>
                <a href={`tel:${hp.number}`} style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: 'var(--primary-light)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: '4px 0 8px 0',
                  transition: 'color var(--transition-fast)'
                }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--primary-light)'}>
                  <Phone size={18} />
                  <span>{hp.number}</span>
                </a>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                  {getTranslation(lang, hp.desc)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Email Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel" 
          style={{ padding: '40px', border: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px', borderBottom: '1px solid var(--border-inner)', paddingBottom: '14px' }}>
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <Mail size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {getTranslation(lang, 'contactFeedbackTitle')}
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: '24px', lineHeight: '1.6' }}>
            {getTranslation(lang, 'contactFeedbackDesc')}
          </p>
          <a href="mailto:support@smartkrishi.gov.in" style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--primary-light)',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)'
          }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--primary-light)'}>
            support@smartkrishi.gov.in
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
