import React, { useContext } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, Sun, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const WeatherCard = ({ weather }) => {
  const { lang } = useContext(LanguageContext);
  if (!weather || weather === 'N/A' || !weather.current) return null;

  const { temperature, humidity, rainfall, windSpeed, condition, rainProbability } = weather.current;

  const getWeatherIcon = (cond) => {
    const c = String(cond).toLowerCase();
    if (c.includes('sun') || c.includes('clear')) {
      return <Sun size={32} style={{ color: 'orange', fill: 'orange' }} />;
    }
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain size={32} style={{ color: '#3b82f6' }} />;
    }
    if (c.includes('cloud')) {
      return <CloudSun size={32} style={{ color: 'var(--text-muted)' }} />;
    }
    return <Cloud size={32} style={{ color: 'var(--text-muted)' }} />;
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
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CloudSun size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, 'weatherTitle')}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        {getWeatherIcon(condition)}
        <div>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.1' }}>
            {temperature}°C
          </span>
          <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
            {getTranslation(lang, condition)}
          </span>
        </div>
      </div>

      {/* Weather Attributes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-inner)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Thermometer size={18} style={{ color: 'orange' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>
              {getTranslation(lang, 'weatherSensible')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{temperature}°C</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Droplets size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>
              {getTranslation(lang, 'weatherHumidity')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{humidity}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.08)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <Wind size={18} style={{ color: '#14b8a6' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>
              {getTranslation(lang, 'weatherWind')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{windSpeed} km/h</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
            <CloudRain size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>
              {getTranslation(lang, 'weatherRain')}
            </span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{rainProbability}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
