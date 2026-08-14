import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { getTranslation } from '../utils/i18n';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, changeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const navLinks = [
    { name: getTranslation(lang, 'navHome'), path: '/' },
    { name: getTranslation(lang, 'navRecommendation'), path: '/recommendation' },
    { name: getTranslation(lang, 'navWeather'), path: '/weather' },
    { name: getTranslation(lang, 'navMarket'), path: '/market' },
    { name: getTranslation(lang, 'navAbout'), path: '/about' },
    { name: getTranslation(lang, 'navContact'), path: '/contact' }
  ];

  return (
    <nav className="glass-panel" style={{
      borderRadius: '0',
      position: 'sticky',
      top: '0',
      zIndex: 100,
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(var(--glass-blur))',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--primary)', fontWeight: '800', fontSize: '1.4rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Leaf size={22} style={{ color: '#fff', fill: '#fff' }} />
          </div>
          <span style={{ color: '#fff' }}>Smart Krishi</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-menu">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ 
                  padding: '8px 16px',
                  borderRadius: '10px',
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
                {isActive && (
                  <motion.span 
                    layoutId="activeNavBackground"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(34, 197, 94, 0.08)',
                      borderRadius: '10px',
                      zIndex: 1
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Theme Toggle Removed - Locked to Dark Mode */}

          {/* Language Selector Dropdown */}
          <select 
            value={lang} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '12px',
              width: 'auto',
              outline: 'none'
            }}
          >
            <option value="en">🇬🇧 EN</option>
            <option value="hi">🇮🇳 HI</option>
            <option value="gj">🇮🇳 GJ</option>
          </select>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="mobile-toggle-btn" style={{ display: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select 
              value={lang} 
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: '600',
                width: 'auto',
                outline: 'none'
              }}
            >
              <option value="en">🇬🇧 EN</option>
              <option value="hi">🇮🇳 HI</option>
              <option value="gj">🇮🇳 GJ</option>
            </select>
            {/* Theme Toggle Removed - Locked to Dark Mode */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn-secondary" style={{ padding: '8px', borderRadius: '12px', minWidth: '38px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 99
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '1rem',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media query overrides */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
