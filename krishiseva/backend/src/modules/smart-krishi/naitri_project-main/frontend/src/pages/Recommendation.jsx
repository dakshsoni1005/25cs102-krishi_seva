import React, { useState, useContext } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import Loading from '../components/Loading';
import SoilCard from '../components/SoilCard';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import FertilizerCard from '../components/FertilizerCard';
import IrrigationCard from '../components/IrrigationCard';
import DiseaseCard from '../components/DiseaseCard';
import PestCard from '../components/PestCard';
import AdvisoryCard from '../components/AdvisoryCard';
import AIRecommendationCard from '../components/AIRecommendationCard';
import { getRecommendations } from '../services/api';
import { HelpCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Recommendation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [result, setResult] = useState(null);
  const [queryParams, setQueryParams] = useState(null);

  const handleFormSubmit = async (params) => {
    setLoading(true);
    setError('');
    setValidationError(null);
    setResult(null);
    setQueryParams(params);

    try {
      const res = await getRecommendations(params);
      if (res && res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (err.response?.status === 400 && resData && resData.success === false) {
        setValidationError({
          message: resData.message,
          suggestion: resData.suggestion || 'Please choose a more suitable crop for this district.',
          recommendedCrops: resData.recommendedCrops
        });
      } else {
        setError(resData?.message || err.message || 'Failed to connect to backend server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const { lang } = useContext(LanguageContext);

  return (
    <div className="container" style={{ padding: '40px 0 80px 0', position: 'relative' }}>
      {/* Background Watermark Image & Mesh Glows */}
      <div className="mesh-glow-container" style={{
        backgroundImage: 'url("file:///d:/Krishiseva/plant.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.05
      }}>
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
        <div className="mesh-glow-3"></div>
      </div>

      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '14px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {lang === 'en' ? (
            "Smart Krishi Decision System"
          ) : (
            getTranslation(lang, 'navRecommendation')
          )}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          {getTranslation(lang, 'formSubtitle')}
        </p>
      </motion.div>

      {/* Query Filter form */}
      <RecommendationForm onSubmit={handleFormSubmit} />

      {/* Dynamic Report Wrapper */}
      <AnimatePresence mode="wait">
        {loading && <Loading key="loading-state" />}

        {error && (
          <motion.div 
            key="error-boundary"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel" 
            style={{
              maxWidth: '650px',
              margin: '24px auto',
              borderLeft: '6px solid #ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', marginBottom: '12px' }}>
              <AlertOctagon size={24} />
              <h4 style={{ fontWeight: '800', fontSize: '1.2rem', margin: 0 }}>Advisory Query Error</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, lineHeight: '1.6' }}>{error}</p>
          </motion.div>
        )}

        {/* Soil Suitability Warning Card */}
        {validationError && (
          <motion.div 
            key="validation-boundary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel" 
            style={{
              maxWidth: '680px',
              margin: '24px auto',
              borderLeft: '6px solid var(--secondary)',
              backgroundColor: 'rgba(234, 179, 8, 0.03)',
              border: '1px solid rgba(234, 179, 8, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', marginBottom: '16px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>Soil Suitability Warning</h3>
            </div>
            <p style={{ fontWeight: '700', fontSize: '1.08rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
              {validationError.message}
            </p>
            {validationError.suggestion && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: '28px', lineHeight: '1.6' }}>
                💡 {validationError.suggestion}
              </p>
            )}

            {validationError.recommendedCrops && validationError.recommendedCrops.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-inner)', paddingTop: '24px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '14px', letterSpacing: '0.04em' }}>
                  Recommended crops for this district's soil type:
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {validationError.recommendedCrops.map((cropName, idx) => (
                    <motion.button 
                      whileHover={{ scale: 1.05, translateY: -2 }}
                      whileTap={{ scale: 0.95 }}
                      key={idx} 
                      className="btn btn-secondary" 
                      onClick={() => {
                        if (queryParams) {
                          handleFormSubmit({ ...queryParams, crop: cropName });
                        }
                      }}
                      style={{ padding: '10px 18px', fontSize: '0.88rem', borderRadius: '12px' }}
                    >
                      {cropName}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Results output grid */}
        {result && result.data && (
          <motion.div 
            key="results-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '32px' }}
          >
            
            {/* AI Advisor Panel */}
            <AIRecommendationCard recommendation={result.recommendation} />

            {/* Warnings & Advisories */}
            <AdvisoryCard advisories={result.data.advisories} />

            {/* Environmental parameters grid */}
            <div className="grid-cols-12">
              
              {/* Soil Properties */}
              <div className="col-span-6">
                <SoilCard soil={result.data.soil} />
              </div>

              {/* Current Weather */}
              <div className="col-span-6">
                <WeatherCard weather={result.data.weather} />
              </div>

              {/* Fertilizers */}
              <div className="col-span-6">
                <FertilizerCard fertilizers={result.data.fertilizers} />
              </div>

              {/* Irrigation */}
              <div className="col-span-6">
                <IrrigationCard irrigation={result.data.irrigation} />
              </div>

              {/* Diseases */}
              <div className="col-span-6">
                <DiseaseCard diseases={result.data.diseases} />
              </div>

              {/* Pests */}
              <div className="col-span-6">
                <PestCard pests={result.data.pests} />
              </div>

              {/* Weather 7-Day Forecast */}
              {result.data.weather && result.data.weather.forecast && (
                <div className="col-span-12">
                  <ForecastCard forecast={result.data.weather.forecast} />
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Empty Visual State */}
        {!loading && !result && !error && !validationError && (
          <motion.div 
            key="empty-state"
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
            <HelpCircle size={44} style={{ marginBottom: '14px', color: 'var(--text-muted)' }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', maxWidth: '420px', lineHeight: '1.6' }}>
              No query results loaded. Submit the parameter filter panel above to query agricultural conditions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recommendation;
