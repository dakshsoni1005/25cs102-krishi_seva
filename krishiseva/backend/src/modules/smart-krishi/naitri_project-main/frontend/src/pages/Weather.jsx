import React, { useState, useEffect, useContext } from 'react';
import DistrictDropdown from '../components/DistrictDropdown';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import { getWeather } from '../services/api';
import { CloudRainWind, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Weather = () => {
  const { lang } = useContext(LanguageContext);
  const [district, setDistrict] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!district) {
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');
    getWeather(district)
      .then(res => {
        if (res && res.success) {
          setWeather(res.data);
        } else {
          setError(
            lang === 'hi'
              ? 'मौसम डेटा प्राप्त करने में विफल।'
              : lang === 'gj'
              ? 'હવામાન ડેટા મેળવવામાં નિષ્ફળ.'
              : 'Failed to fetch weather data.'
          );
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(
          lang === 'hi'
            ? 'इस जिले के लिए मौसम डेटा अनुपलब्ध है।'
            : lang === 'gj'
            ? 'આ જિલ્લા માટે હવામાન ડેટા ઉપલબ્ધ નથી.'
            : 'Weather data unavailable for this district.'
        );
        setLoading(false);
      });
  }, [district, lang]);

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
          {getTranslation(lang, 'weatherHeaderTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          {getTranslation(lang, 'weatherHeaderSubtitle')}
        </p>
      </motion.div>

      {/* Select District Card */}
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
        <DistrictDropdown value={district} onChange={setDistrict} />
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
            <CloudRainWind size={36} style={{ color: 'var(--primary-light)', marginBottom: '12px' }} />
            <p style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
              {getTranslation(lang, 'weatherLoading')}
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

        {weather && !loading && (
          <motion.div 
            key="weather-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
              <WeatherCard weather={{ current: weather.current }} />
            </div>

            {weather.forecast && (
              <div style={{ marginTop: '16px' }}>
                <ForecastCard forecast={weather.forecast} />
              </div>
            )}
          </motion.div>
        )}

        {!district && !loading && (
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
              {getTranslation(lang, 'weatherEmpty')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Weather;
