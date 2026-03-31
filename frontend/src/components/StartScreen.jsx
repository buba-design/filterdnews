import React, { useState } from 'react';
import logo from '../assets/logo.png';
import warningImg from '../assets/warning.png';

const TICKER_TEXT =
  'This website uses AI to gather and reshape news from across the internet. Delivered in a format you choose. Take control of your information. Slow down, question what you see, and decide how you want to engage with the news.     ';

const StartScreen = ({ onSelectMode }) => {
  const [showImpressum, setShowImpressum] = useState(false);
  const [hovered, setHovered] = useState(null);

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
      paddingBottom: '18vh', /* shifts content upward */
    }}>

      {/* ── Logo ── */}
      <img
        src={logo}
        alt="FilterdNews Logo"
        style={{
          width: 'clamp(260px, 48vw, 620px)',
          marginBottom: '6rem',
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

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Relaxed button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
          <button
            className="btn btn-green"
            onClick={() => onSelectMode('relaxed')}
            onMouseEnter={() => setHovered('relaxed')}
            onMouseLeave={() => setHovered(null)}
            style={{ width: '100%' }}
          >
            relaxed
          </button>
          <p style={{
            marginTop: '10px',
            fontSize: '0.72rem',
            letterSpacing: '0.3px',
            lineHeight: '1.5',
            textAlign: 'center',
            color: '#555',
            fontFamily: 'var(--font-default)',
            maxWidth: '140px',
            opacity: hovered === 'relaxed' ? 1 : 0,
            transform: hovered === 'relaxed' ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}>
            Unwind with soothing news that clears your mind and helps you relax.
          </p>
        </div>

        {/* Rushed button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
          <button
            className="btn btn-red"
            onClick={() => onSelectMode('rushed')}
            onMouseEnter={() => setHovered('rushed')}
            onMouseLeave={() => setHovered(null)}
            style={{ width: '100%' }}
          >
            rushed
          </button>
          <p style={{
            marginTop: '10px',
            fontSize: '0.72rem',
            letterSpacing: '0.3px',
            lineHeight: '1.5',
            textAlign: 'center',
            color: '#555',
            fontFamily: 'var(--font-default)',
            maxWidth: '140px',
            opacity: hovered === 'rushed' ? 1 : 0,
            transform: hovered === 'rushed' ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}>
            All the political updates you need. Clear, concise, and in one place.
          </p>
        </div>
      </div>

      {/* ── Warning Banner (just above the bottom ticker) ── */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        <img
          src={warningImg}
          alt="Work in progress – university project"
          style={{
            height: '52px',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />
      </div>

      {/* ── Info / Impressum Button (bottom-right, above ticker) ── */}
      <button
        onClick={() => setShowImpressum(true)}
        title="Impressum"
        style={{
          position: 'absolute',
          bottom: '46px',
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
        height: '36px',
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
          animation: 'startTicker 28s linear infinite',
          fontFamily: 'var(--font-default)',
          fontSize: '0.8rem',
          letterSpacing: '0.5px',
        }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} style={{ paddingRight: '80px' }}>{TICKER_TEXT}</span>
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
            backgroundColor: 'rgba(0,0,0,0.12)',
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
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              fontFamily: 'var(--font-default)',
              fontSize: '0.95rem',
              lineHeight: '1.9',
              color: '#222',
              textAlign: 'center',
            }}
          >
            {/* Close X */}
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
                fontSize: '1.1rem',
                lineHeight: 1,
                color: '#333',
              }}
            >
              ×
            </button>

            <p style={{ marginBottom: '2rem', letterSpacing: '1px' }}>impressum:</p>

            <p>dennis polster</p>
            <a
              href="mailto:dennis.polster@study.hs-duesseldorf.de"
              style={{ color: '#222', textDecoration: 'none' }}
            >
              dennis.polster@study.hs-duesseldorf.de
            </a>

            <p style={{ margin: '2.5rem 0 1rem', letterSpacing: '1px' }}>quellen:</p>

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

export default StartScreen;
