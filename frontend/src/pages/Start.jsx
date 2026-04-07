import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import warningImg from '../assets/warning.png';

const TICKER_TEXT =
  'This website uses AI to gather and reshape news from across the internet—delivered in a format you choose. Take control of your information. Slow down, question what you see, and decide how you want to engage with the news.';

const Start = () => {
  const navigate = useNavigate();
  const [showImpressum, setShowImpressum] = useState(false);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Logo ── */}
      <img
        src={logo}
        alt="FilterdNews Logo"
        style={{
          width: 'clamp(320px, 60vw, 840px)',
          marginBottom: '3rem',
          userSelect: 'none',
        }}
      />

      {/* ── Question + Buttons ── */}
      <p style={{
        marginBottom: '2rem',
        fontSize: '1.1rem',
        letterSpacing: '1px',
        fontFamily: 'var(--font-default)',
      }}>
        How would you like to see the news today?
      </p>

      <div style={{ display: 'flex', gap: '30px' }}>
        <button className="btn btn-green" onClick={() => navigate('/relaxed')}>
          relaxed
        </button>
        <button className="btn btn-red" onClick={() => navigate('/rushed')}>
          rushed
        </button>
      </div>

      {/* ── Warning Banner (just above the bottom ticker) ── */}
      <div style={{
        position: 'absolute',
        bottom: '50px',   /* sits directly above the 48px-high ticker bar */
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        <img
          src={warningImg}
          alt="Work in progress – university project"
          style={{
            height: '66px',
            objectFit: 'contain',
            userSelect: 'none',
            animation: 'pulseScaleImg 1.5s infinite alternate ease-in-out'
          }}
        />
      </div>

      {/* ── Info / Impressum Button (bottom-right) ── */}
      <button
        onClick={() => setShowImpressum(true)}
        title="Impressum"
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '20px',
          background: 'none',
          border: '1.5px solid #333',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: '700',
          fontFamily: 'var(--font-default)',
          color: '#333',
          zIndex: 20,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        i
      </button>

      {/* ── Bottom Ticker ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '48px',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        zIndex: 15,
      }}>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'startTicker 30s linear infinite',
          fontFamily: 'var(--font-default)',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
        }}>
          {/* Triple the text so loop is seamless */}
          {[0, 1, 2].map(i => (
            <span key={i} style={{ paddingRight: '100px' }}>{TICKER_TEXT}</span>
          ))}
        </div>
      </div>

      {/* ── Impressum Modal ── */}
      {showImpressum && (
        <div
          onClick={() => setShowImpressum(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              width: 'min(600px, 90vw)',
              padding: '60px 80px',
              position: 'relative',
              fontFamily: 'var(--font-default)',
              fontSize: '0.95rem',
              lineHeight: '1.8',
              color: '#222',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowImpressum(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: '1.5px solid #333',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#333',
              }}
            >
              ×
            </button>

            <p style={{ marginBottom: '2rem', fontSize: '1rem', letterSpacing: '1px' }}>
              impressum:
            </p>

            <p style={{ marginBottom: '0.3rem' }}>dennis polster</p>
            <a
              href="mailto:dennis.polster@study.hs-duesseldorf.de"
              style={{ color: '#222', textDecoration: 'none' }}
            >
              dennis.polster@study.hs-duesseldorf.de
            </a>

            <p style={{ margin: '2.5rem 0 1rem', fontSize: '1rem', letterSpacing: '1px' }}>
              quellen:
            </p>

            {[
              'http://feeds.bbci.co.uk/news/world/rss.xml',
              'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
              'https://www.goodnewsnetwork.org/category/news/feed/',
              'https://feeds.npr.org/1007/rss.xml',
              'https://feeds.npr.org/1008/rss.xml',
            ].map(url => (
              <p key={url} style={{ marginBottom: '0.2rem', wordBreak: 'break-all', fontSize: '0.82rem', color: '#555' }}>
                {url}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
