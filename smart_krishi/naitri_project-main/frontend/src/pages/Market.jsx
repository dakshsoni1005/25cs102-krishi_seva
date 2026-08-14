import React, { useState, useEffect, useContext } from 'react';
import CropDropdown from '../components/CropDropdown';
import { getMarketPrices } from '../services/api';
import { Landmark, TrendingUp, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Market = () => {
  const { lang } = useContext(LanguageContext);
  const [crop, setCrop] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!crop) {
      setPrices([]);
      return;
    }

    setLoading(true);
    setError('');
    getMarketPrices(crop)
      .then(res => {
        if (res && res.success) {
          setPrices(res.data || []);
        } else {
          setError(
            lang === 'hi'
              ? 'बाजार की थोक दरें प्राप्त करने में विफल।'
              : lang === 'gj' ? 'બજાર ભાવો મેળવવામાં નિષ્ફળ.' : 'Failed to fetch market prices.'
          );
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(
          lang === 'hi'
            ? 'इस फसल के लिए बाजार मूल्य सूचकांक अनुपलब्ध हैं।'
            : lang === 'gj' ? 'આ પાક માટે બજાર ભાવો ઉપલબ્ધ નથી.' : 'Market price indices unavailable for this crop.'
        );
        setLoading(false);
      });
  }, [crop, lang]);

  return (
    <div className="container" style={{ padding: '40px 0 80px 0', position: 'relative' }}>
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
          {getTranslation(lang, 'marketTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          {getTranslation(lang, 'marketSubtitle')}
        </p>
      </motion.div>

      {/* Select Crop Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel" 
        style={{
          maxWidth: '520px',
          margin: '0 auto 48px auto',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <CropDropdown value={crop} onChange={setCrop} />
      </motion.div>

      {/* Dynamic Render Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '60px 40px' }} 
            className="pulse-loader"
          >
            <TrendingUp size={36} style={{ color: 'var(--primary-light)', marginBottom: '12px' }} />
            <p style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
              {getTranslation(lang, 'marketLoading')}
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel" 
            style={{
              maxWidth: '520px',
              margin: '20px auto',
              padding: '24px',
              borderLeft: '4px solid #ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', marginBottom: '8px' }}>
              <AlertTriangle size={20} />
              <span style={{ fontWeight: '700', fontSize: '1rem' }}>{error}</span>
            </div>
          </motion.div>
        )}

        {prices.length > 0 && !loading && (
          <motion.div 
            key="prices-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }} 
            className="glass-panel"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px', borderBottom: '1px solid var(--border-inner)', paddingBottom: '16px' }}>
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex'
              }}>
                <Landmark size={22} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                {getTranslation(lang, crop)} {lang === 'hi' ? 'APMC दरें' : lang === 'gj' ? 'APMC બજાર ભાવો' : 'APMC Price Indexes'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {prices.map((p, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-inner)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }} className="hover-lift">
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', display: 'block', color: 'var(--text-primary)' }}>
                      {p.marketYard || 'APMC Yard'}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {lang === 'hi' ? 'जिला:' : lang === 'gj' ? 'જિલ્લો:' : 'District:'} {getTranslation(lang, p.district_id?.name || 'Local')}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.35rem', color: 'var(--primary-light)', display: 'block', lineHeight: '1.2' }}>
                      ₹{p.price}/{lang === 'hi' ? 'क्विंटल' : lang === 'gj' ? 'ક્વિન્ટલ' : 'quintal'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {lang === 'hi' ? 'अंतिम अपडेट:' : lang === 'gj' ? 'છેલ્લો સુધારો:' : 'Last Update:'} {new Date(p.updatedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!crop && !loading && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}
          >
            <HelpCircle size={44} style={{ marginBottom: '14px' }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', maxWidth: '420px', lineHeight: '1.6' }}>
              {getTranslation(lang, 'marketEmpty')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Market;
