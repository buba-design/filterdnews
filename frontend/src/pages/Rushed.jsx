import React, { useState, useEffect } from 'react';
// NOTE: `motion` is used via JSX tags like `<motion.div>`, which can confuse `no-unused-vars`.
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import Header from '../components/Header';

const MarqueeRow = ({ text }) => {
  const [hovered, setHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (hovered) {
      controls.start({
        x: '-50%',
        transition: {
          ease: 'linear',
          duration: 15,
          repeat: Infinity,
        }
      });
    } else {
      controls.stop();
      // Ensure it stays where it is or snaps to start depending on preference.
      // Based on instructions: "Headlines DO NOT MOVE by default. ONLY when user hovers a row -> starts moving".
    }
  }, [hovered, controls]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100vw',
        padding: '12px 20px',
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'var(--font-rushed)',
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        borderBottom: '4px solid white',
        cursor: 'default',
        boxSizing: 'border-box',
        display: 'flex'
      }}
    >
      <motion.div
        animate={controls}
        initial={{ x: 0 }}
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ paddingRight: '100px' }}>{text}</span>
        <span style={{ paddingRight: '100px' }}>{text}</span>
        <span style={{ paddingRight: '100px' }}>{text}</span>
        <span style={{ paddingRight: '100px' }}>{text}</span>
      </motion.div>
    </div>
  );
};

const Rushed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rushed) {
          setNews(data.rushed);
        }
      })
      .catch(err => {
        console.error("Fetch failed", err);
        // Fallback dummy data if backend fails
        setNews([
            { "title": "CONSERVATIVES SPLIT OVER IRAN WAR: A MAJOR DIVIDE HEATS UP" },
            { "title": "RULE OF LAW CONCERNS RISING ACROSS EUROPE: FAR-RIGHT IMMIGRATION PLANS" },
            { "title": "FEDERAL RESERVE LEADERSHIP BATTLE HEATS UP. A SENATE SHOWDOWN EXPECTED." },
            { "title": "NEW MAYOR OF PARIS TAKES OFFICE AMIDST ONGOING MASSIVE TRAFFIC CHAOS" },
            { "title": "MASSIVE “NO KINGS” PROTESTS RESHAPE US POLITICS: OVER 80,000 MARCH" },
            { "title": "PROTESTS SIGNAL GROWING ANTI-GOVERNMENT SENTIMENT ACROSS THE NATION" },
            { "title": "AROUND 50,000 PEOPLE MARCHED IN LONDON OPPOSING THE NEW ECONOMIC BILL" }
        ]);
      });
  }, []);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'black',
      color: 'white',
      paddingTop: '80px',
      overflowX: 'hidden'
    }}>
      <div style={{ color: 'white' }}>
         <Header />
      </div>
      
      {/* List of horizontal rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {news.map((item, index) => (
          <MarqueeRow key={index} text={item.title} />
        ))}
      </div>
    </div>
  );
};

export default Rushed;
