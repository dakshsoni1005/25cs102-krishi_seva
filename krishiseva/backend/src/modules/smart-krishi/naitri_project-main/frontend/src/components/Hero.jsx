import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, Sun, Cpu, Sparkles, Droplets, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Hero = () => {
  const { lang } = useContext(LanguageContext);
  const [typingIndex, setTypingIndex] = useState(0);

  const aiStatusList = lang === 'hi' ? [
    "गूगल जेमिनी एआई से परामर्श...",
    "मिट्टी की विशेषताओं का मिलान...",
    "पानी की समय-सारणी का अनुकूलन...",
    "रोग भविष्यवाणी जाँच चल रही है..."
  ] : lang === 'gj' ? [
    "ગૂગલ જેમિની AI ની સલાહ...",
    "જમીનની લાક્ષણિકતાઓનું સંકલન...",
    "પાણીના સમયપત્રકનું અનુકૂલન...",
    "રોગની આગાહીની ચકાસણી..."
  ] : [
    "Consulting Google Gemini AI...",
    "Matching clay loam properties...",
    "Optimizing watering schedules...",
    "Running disease prediction checks..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTypingIndex(prev => (prev + 1) % aiStatusList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [aiStatusList.length]);

  return (
    <div style={{
      position: 'relative',
      margin: '20px 0 60px 0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      {/* Visual Mesh Backgrounds */}
      <div className="mesh-glow-container" style={{ pointerEvents: 'none' }}>
        <div className="mesh-glow-1" style={{ top: '-10%', left: '20%', width: '350px', height: '350px', backgroundColor: 'rgba(34, 197, 94, 0.08)' }}></div>
        <div className="mesh-glow-2" style={{ bottom: '10%', right: '10%', width: '400px', height: '400px', backgroundColor: 'rgba(20, 184, 166, 0.05)' }}></div>
      </div>

      <div className="grid-cols-12" style={{ alignItems: 'center', gap: '32px' }}>
        
        {/* Left Column - Headline & CTAs */}
        <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 2 }}>
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              color: 'var(--primary-light)',
              fontWeight: '700',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              gap: '6px',
              alignItems: 'center'
            }}
          >
            <Sparkles size={14} />
            <span>{getTranslation(lang, 'heroTagline')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: '3.4rem',
              fontWeight: '800',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            {lang === 'en' ? (
              "Cultivating the Future of Smart Farming"
            ) : (
              getTranslation(lang, 'heroHeadline')
            )}
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              margin: 0,
              maxWidth: '560px'
            }}
          >
            {getTranslation(lang, 'heroSubtitle')}
          </motion.p>

          {/* Actions CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/recommendation" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                <span>{getTranslation(lang, 'heroCTAStart')}</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/weather" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                <span>{getTranslation(lang, 'heroCTAWeather')}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '24px',
              borderTop: '1px solid var(--border-inner)',
              paddingTop: '28px'
            }}
          >
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-light)', display: 'block', lineHeight: '1.1' }}>33</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{getTranslation(lang, 'heroStatDistricts')}</span>
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-light)', display: 'block', lineHeight: '1.1' }}>100%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{getTranslation(lang, 'heroStatData')}</span>
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6', display: 'block', lineHeight: '1.1' }}>Instant</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{getTranslation(lang, 'heroStatReport')}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Premium High-Tech Isometric Showcase */}
        <div className="col-span-6" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{
              width: '100%',
              maxWidth: '480px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg), 0 0 40px rgba(34, 197, 94, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              background: 'var(--surface)',
              lineHeight: 0
            }}
            className="hover-lift"
          >
            <img 
              src="/src/assets/hero_illustration.jpg" 
              alt="Smart Agriculture Isometric Ecosystem" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover'
              }} 
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
