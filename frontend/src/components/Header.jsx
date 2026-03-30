import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const Header = ({ darkMode = false, buttonColor = '#ccc' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If App.jsx is state-based, pathname is always '/'. 
  // We can use our darkMode prop or the mode state. 
  // For safety, let's keep the existing logic but override with darkMode.
  const isStartPage = location.pathname === '/' && !darkMode;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      pointerEvents: 'none' // allow clicking through empty space
    }}>
      {/* Centered Logo text */}
      <h1 style={{
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '900',
        letterSpacing: '2px',
        fontFamily: 'var(--font-rushed)',
        color: darkMode ? 'white' : 'black',
      }} className="logo-text">
        FILTERDNEWS.ORG
      </h1>

      {/* Close button aligned to right, only shown if NOT on start page */}
      {!isStartPage && (
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            right: '40px',
            background: buttonColor,
            transition: 'background-color 0.8s ease',
            border: 'none',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          <X size={20} color={darkMode ? 'white' : 'black'} />
        </button>
      )}
    </header>
  );
};

export default Header;
