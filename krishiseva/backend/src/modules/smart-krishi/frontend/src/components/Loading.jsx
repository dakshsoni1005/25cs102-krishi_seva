import React, { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const farmingTips = [
  "Tip: Avoid watering crops midday to reduce evaporation losses and prevent leaf scorch.",
  "Tip: Deep soils with clay loam textures retain nutrients and moisture much better than sandy soils.",
  "Tip: Adding organic compost regularly improves soil microbial health and structural drainage.",
  "Tip: Check weather forecasts before pesticide spraying. Wind speeds above 25 km/h cause chemical drift.",
  "Tip: Basal fertilizer application (DAP) gives young seedlings the early nitrogen and phosphorus they need."
];

const Loading = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % farmingTips.length);
    }, 4500); // cycle tips every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', marginTop: '20px' }}
    >
      {/* Tip Header Panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        textAlign: 'center',
        gap: '18px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            color: '#fff',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            padding: '16px',
            borderRadius: '20px',
            boxShadow: 'var(--glow-shadow)'
          }}
        >
          <Sprout size={32} />
        </motion.div>
        
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Consulting Smart Krishi Advisor...
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Fetching live weather parameters and compiling recommendation contexts
          </p>
        </div>

        {/* Tip Container */}
        <div className="glass-panel" style={{
          maxWidth: '600px',
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'rgba(34, 197, 94, 0.04)',
          borderRadius: 'var(--radius-md)',
          minHeight: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(34, 197, 94, 0.1)'
        }}>
          <AnimatePresence mode="wait">
            <motion.p 
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                color: 'var(--primary-light)',
                fontWeight: '600',
                fontSize: '0.9rem',
                margin: 0
              }}
            >
              {farmingTips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Shimmer Skeleton Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Large AI Card Skeleton */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton-shimmer" style={{ width: '40%', height: '24px', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: '100%', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: '90%', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: '95%', height: '16px', borderRadius: '4px' }} />
        </div>

        {/* 2-Column Grid Skeletons */}
        <div className="grid-cols-12">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="col-span-6 glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
              <div className="skeleton-shimmer" style={{ width: '50px', height: '50px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton-shimmer" style={{ width: '50%', height: '18px', borderRadius: '4px' }} />
                <div className="skeleton-shimmer" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
                <div className="skeleton-shimmer" style={{ width: '85%', height: '12px', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
