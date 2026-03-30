import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    }}>
      <Header />
      
      <p style={{
        marginBottom: '2rem',
        fontSize: '1.1rem',
        letterSpacing: '1px'
      }}>
        How would you like to see the news today?
      </p>

      <div style={{ display: 'flex', gap: '30px' }}>
        <button 
          className="btn btn-green"
          onClick={() => navigate('/relaxed')}
        >
          relaxed
        </button>
        <button 
          className="btn btn-red"
          onClick={() => navigate('/rushed')}
        >
          rushed
        </button>
      </div>
    </div>
  );
};

export default Start;
