import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recommendation from './pages/Recommendation';
import Weather from './pages/Weather';
import Market from './pages/Market';
import About from './pages/About';
import Contact from './pages/Contact';

export const LanguageContext = React.createContext({
  lang: 'en',
  changeLanguage: () => {}
});

function App() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const changeLanguage = (newLang) => {
    localStorage.setItem('lang', newLang);
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="gradient-bg">
          <Navbar />
          
          <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/market" element={<Market />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
