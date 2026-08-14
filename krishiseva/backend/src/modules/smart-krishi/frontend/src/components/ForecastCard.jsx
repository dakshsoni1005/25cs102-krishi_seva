import React, { useContext } from 'react';
import { CalendarDays, CloudRain, Sun, Cloud, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const ForecastCard = ({ forecast }) => {
  const { lang } = useContext(LanguageContext);
  if (!forecast || !forecast.length) return null;

  // Construct points for the custom SVG Line/Area Temperature graph
  // Width = 700, Height = 120. Margins: Left=30, Right=30, Top=20, Bottom=20
  // Range assumed: 15°C to 45°C
  const points = forecast.map((f, i) => {
    const x = 30 + i * (640 / (forecast.length - 1));
    const maxVal = parseFloat(f.max) || 30;
    const y = 90 - ((maxVal - 15) / 30) * 70; // Map 15-45 to Y range 90-20
    return { x, y };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;

  const getWeatherIcon = (prob) => {
    const p = parseFloat(prob) || 0;
    if (p > 50) return <CloudRain size={20} style={{ color: '#3b82f6' }} />;
    if (p > 20) return <CloudSun size={20} style={{ color: 'var(--text-muted)' }} />;
    return <Sun size={20} style={{ color: 'orange', fill: 'orange' }} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel" 
      style={{ gridColumn: 'span 12', marginTop: '16px', border: '1px solid var(--border)' }}
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
          <CalendarDays size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          {getTranslation(lang, '7-Day Weather Forecast & Trends')}
        </h3>
      </div>

      {/* SVG Temperature Curve Area Chart */}
      <div style={{
        backgroundColor: 'var(--neutral-100)',
        border: '1px solid var(--border-inner)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 16px 16px 16px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '700px', position: 'relative' }}>
          <svg width="700" height="120" style={{ overflow: 'visible' }}>
            {/* Area under the line */}
            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ duration: 1 }}
              d={areaPath} 
              fill="var(--primary)" 
            />
            {/* Temperature Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d={linePath} 
              fill="none" 
              stroke="var(--primary-light)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
            {/* Reference markers and text labels */}
            {points.map((p, idx) => (
              <g key={idx}>
                <motion.circle 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.08, type: "spring" }}
                  cx={p.x} 
                  cy={p.y} 
                  r="6" 
                  fill="var(--background)" 
                  stroke="var(--primary)" 
                  strokeWidth="3" 
                />
                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  fontSize="0.75rem" 
                  fontWeight="800" 
                  fill="var(--text-primary)"
                  fontFamily="var(--font-sans)"
                >
                  {forecast[idx].max}°C
                </text>
                <text 
                  x={p.x} 
                  y={114} 
                  textAnchor="middle" 
                  fontSize="0.7rem" 
                  fontWeight="700" 
                  fill="var(--text-muted)"
                  fontFamily="var(--font-sans)"
                >
                  {getTranslation(lang, forecast[idx].day)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Horizontal Scroll Cards Grid */}
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px'
      }} className="forecast-scroll-container">
        {forecast.map((day, index) => (
          <div key={index} className="glass-panel hover-lift" style={{
            minWidth: '130px',
            flex: '1',
            padding: '20px 16px',
            textAlign: 'center',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-inner)',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 'var(--radius-md)'
          }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              {getTranslation(lang, day.day)}
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              {getWeatherIcon(day.rainProbability)}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0', color: 'var(--secondary)' }}>
              {day.max}°
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              {lang === 'en' ? 'Min' : lang === 'hi' ? 'न्यूनतम' : 'ન્યૂનતમ'}: {day.min}°C
            </span>
            {day.rainProbability !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.78rem', color: '#3b82f6', fontWeight: '600' }}>
                <CloudRain size={12} />
                <span>{day.rainProbability}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .forecast-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .forecast-scroll-container::-webkit-scrollbar-thumb {
          background-color: var(--border-inner);
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

export default ForecastCard;
