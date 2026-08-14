import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(var(--glass-blur))',
      borderTop: '1px solid var(--border)',
      padding: '48px 24px 24px 24px',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
          {/* Brand Info */}
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '800', fontSize: '1.3rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf size={18} style={{ color: '#fff', fill: '#fff' }} />
              </div>
              <span className="gradient-text">Smart Krishi</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', lineHeight: '1.7' }}>
              Empowering farmers across Gujarat with live weather forecasting, soil parameter matching, crop-specific calendars, and real-time AI agricultural advisory.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Quick Navigation
            </h4>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--primary-light)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Home Dashboard</Link>
            <Link to="/recommendation" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--primary-light)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>AI Decision System</Link>
            <Link to="/weather" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--primary-light)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Live Weather Forecast</Link>
            <Link to="/market" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--primary-light)'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Market Price Trends</Link>
          </div>

          {/* Contact Details */}
          <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Support Helpline
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Phone size={16} />
              <span>1800-180-1551 (KCC)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Mail size={16} />
              <span>support@smartkrishi.gov.in</span>
            </div>
            <a 
              href="https://open-meteo.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginTop: '4px' }}
            >
              <span>Weather data by Open-Meteo</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Smart Krishi. All rights reserved. Sourced from Gujarat Agmarknet Databases.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About System</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
