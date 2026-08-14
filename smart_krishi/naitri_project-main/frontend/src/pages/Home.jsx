import React, { useContext } from 'react';
import Hero from '../components/Hero';
import { ShieldCheck, CloudLightning, LineChart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Home = () => {
  const { lang } = useContext(LanguageContext);

  const features = [
    {
      icon: <Sparkles size={26} />,
      title: lang === 'hi' ? 'जेमिनी एआई सलाहकार' : lang === 'gj' ? 'જેમિની AI સલાહકાર' : 'Gemini AI Advisor',
      desc: lang === 'hi' ? 'जेमिनी एआई द्वारा उत्पन्न मृदा गुण सूचकांक, फसल कैलेंडर और चेतावनियों को मिलाकर वास्तविक समय में अनुकूलित दिशानिर्देश।' : lang === 'gj' ? 'જમીન ગુણધર્મો, પાક કેલેન્ડર અને જેમિની AI ચેતવણીઓનો મેળ કરીને રીઅલ-ટાઇમ માર્ગદર્શિકા.' : 'Real-time customized guidelines combining soil property indices, crop calendars, and warnings generated using Gemini AI.',
      glowColor: 'rgba(34, 197, 94, 0.15)',
      iconBg: 'rgba(34, 197, 94, 0.1)',
      link: '/recommendation'
    },
    {
      icon: <CloudLightning size={26} />,
      title: lang === 'hi' ? 'ओपन-मेटियो मौसम' : lang === 'gj' ? 'ઓપન-મેટિયો હવામાન' : 'Open-Meteo Weather',
      desc: lang === 'hi' ? 'स्थानीय अक्षांश/देशांतर निर्देशांकों का उपयोग करके वास्तविक समय का तापमान, आर्द्रता, पवन मीट्रिक और 7-दिवसीय पूर्वानुमान।' : lang === 'gj' ? 'સ્થાનિક અક્ષાંશ/રેખાંશ આધારે લાઈવ તાપમાન, ભેજ, પવનની ગતિ અને ૭-દિવસની હવામાન આગાહી.' : 'Live temperature, humidity parameters, wind metrics, and 7-day forecast queries resolved using localized lat/lng coordinates.',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      iconBg: 'rgba(59, 130, 246, 0.1)',
      link: '/weather'
    },
    {
      icon: <ShieldCheck size={26} />,
      title: lang === 'hi' ? 'नियम-आधारित सुरक्षा अलर्ट' : lang === 'gj' ? 'નિયમ-આધારિત સુરક્ષા ચેતવણીઓ' : 'Rule-Based Safety Alerts',
      desc: lang === 'hi' ? 'कीटनाशक बहाव, क्रिटिकल ह्यूमिडिटी रोग इंडेक्स, हीट-स्ट्रेस अलार्म और सिंचाई गाइड को लक्षित करने वाले स्वचालित थ्रेसहोल्ड अलर्ट।' : lang === 'gj' ? 'જંતુનાશક વપરાશ, રોગ સૂચકાંકો, હીટ-સ્ટ્રેસ એલાર્મ અને સિંચાઈ માટે સ્વયંસંચાલિત થ્રેશોલ્ડ એલર્ટ.' : 'Automatic threshold alerts targeting pesticide drift, critical humidity disease indexes, heat-stress alarms, and irrigation guides.',
      glowColor: 'rgba(234, 179, 8, 0.15)',
      iconBg: 'rgba(234, 179, 8, 0.1)',
      link: '/recommendation'
    },
    {
      icon: <LineChart size={26} />,
      title: lang === 'hi' ? 'APMC बाजार रुझान' : lang === 'gj' ? 'APMC બજાર પ્રવાહો' : 'APMC Market Trends',
      desc: lang === 'hi' ? 'गुजरात एपीएमसी डेटाबेस से सीधे प्राप्त फसलों के बाजार मूल्य रुझान और प्रति क्विंटल थोक मूल्यों का पता लगाएं।' : lang === 'gj' ? 'ગુજરાત APMC ડેટાબેઝમાંથી સીધા મેળવેલા પાકના બજાર ભાવો અને જથ્થાબંધ કિંમત પ્રવાહો જુઓ.' : 'Explore crop market value trends and localized price indices per quintal sourced directly from Gujarat APMC databases.',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      iconBg: 'rgba(168, 85, 247, 0.1)',
      link: '/market'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="container" style={{ padding: '20px 0 60px 0', position: 'relative' }}>
      {/* Background Glows */}
      <div className="mesh-glow-container">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
        <div className="mesh-glow-3"></div>
      </div>

      {/* Hero Header */}
      <Hero />

      {/* Feature Grid */}
      <div style={{ margin: '80px 0 40px 0' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.015em', color: 'var(--text-primary)' }}>
            {lang === 'en' ? 'Core Capabilities' : lang === 'hi' ? 'मुख्य विशेषताएं' : 'મુખ્ય સુવિધાઓ'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            {lang === 'en' 
              ? 'Smart Krishi integrates localized sensory databases with advanced artificial intelligence pipelines.' 
              : lang === 'hi' 
              ? 'स्मार्ट कृषि उन्नत कृत्रिम बुद्धिमत्ता पाइपलाइनों के साथ स्थानीय संवेदी डेटाबेस को एकीकृत करती है।' 
              : 'સ્માર્ટ કૃષિ અદ્યતન આર્ટિફિશિયલ ઇન્ટેલિજન્સ પાઇપલાઇન્સ સાથે સ્થાનિક ડેટાબેસેસને સાંકળે છે.'}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid-cols-12"
        >
          {features.map((feature, index) => (
            <motion.div 
              variants={itemVariants}
              key={index} 
              className="col-span-6 glass-panel hover-lift"
              style={{
                padding: '32px',
                border: '1px solid var(--border)',
                display: 'flex',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.02), ${feature.glowColor}`
              }}
            >
              {/* Highlight background radial */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: feature.iconBg,
                filter: 'blur(20px)',
                pointerEvents: 'none'
              }} />

              {/* Icon Container */}
              <div style={{
                backgroundColor: feature.iconBg,
                padding: '14px',
                borderRadius: '16px',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'fit-content'
              }}>
                {feature.icon}
              </div>

              {/* Text detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                  {feature.desc}
                </p>
                <Link 
                  to={feature.link} 
                  style={{ 
                    marginTop: '8px', 
                    fontSize: '0.82rem', 
                    fontWeight: '700', 
                    color: 'var(--primary-light)', 
                    textDecoration: 'none',
                    alignSelf: 'flex-start'
                  }}
                >
                  {lang === 'en' ? 'Explore ➔' : lang === 'hi' ? 'अन्वेषण करें ➔' : 'અન્વેષણ કરો ➔'}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
