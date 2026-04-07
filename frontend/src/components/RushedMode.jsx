import React, { useEffect, useState } from 'react';
// NOTE: `motion` is used via JSX tags like `<motion.div>`, which can confuse `no-unused-vars`.
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import Header from './Header';

const NewsRow = ({ item, index }) => {
  const flags = ['us', 'fr', 'gb', 'ir', 'de']; // Avoid 'cn' as 'C' flags are missing
  
  // Robustly handle common non-ISO AI responses
  let rawCode = item.countryCode ? item.countryCode.toLowerCase().trim() : flags[index % flags.length];
  const aliasMap = {
    'uk': 'gb',
    'usa': 'us',
    'eng': 'gb-eng',
    'un': 'us',
    'ca': 'us', // Mapping missing 'C' countries due to missing assets
    'cn': 'hk',
    'cu': 'mx'
  };
  const flagCode = aliasMap[rawCode] || rawCode;
  const flagUrl = `/small_flags/${encodeURIComponent(flagCode + ' Small Small Small.jpeg')}`;

  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        x: '-50%',
        transition: {
          ease: 'linear',
          duration: item.duration || 15,
          repeat: Infinity,
        }
      });
    } else {
      controls.stop();
      controls.start({
        x: '0%',
        transition: {
          ease: 'circOut',
          duration: 0.6,
        }
      });
    }
  }, [isHovered, controls, item.duration]);

  return (
    <div 
      className="marquee-row"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="row-flag">
        <img 
          src={flagUrl} 
          alt={`${flagCode} flag`} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/small_flags/us Small Small Small.jpeg'; 
          }} 
        />
      </div>
      <div className="marquee-content-wrapper">
        <motion.div 
          className="marquee-content" 
          animate={controls}
          initial={{ x: '0%' }}
        >
          <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
          <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
          <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
        </motion.div>
      </div>
      <a href={item.url || "#"} target="_blank" rel="noopener noreferrer" className="row-plus">
        +
      </a>
    </div>
  );
};

const initialRushedData = [
  { "title": "CONSERVATIVES SPLIT OVER IRAN WAR", "summary": "A MAJOR DIVIDE HEATS UP", "countryCode": "us" },
  { "title": "RULE OF LAW CONCERNS RISING ACROSS EUROPE", "summary": "FAR-RIGHT IMMIGRATION PLANS", "countryCode": "eu" },
  { "title": "FEDERAL RESERVE LEADERSHIP BATTLE HEATS UP", "summary": "A SENATE SHOWDOWN EXPECTED", "countryCode": "us" },
  { "title": "NEW MAYOR OF PARIS TAKES OFFICE", "summary": "AMIDST ONGOING MASSIVE TRAFFIC CHAOS", "countryCode": "fr" },
  { "title": "MARKET WATCH: TECH STOCKS RALLY", "summary": "NEW INNOVATIONS SPARK INVESTOR OPTIMISM", "countryCode": "us" }
];

let initialProcessed = [...initialRushedData];
while (initialProcessed.length < 25) {
   initialProcessed = [...initialProcessed, ...initialRushedData];
}
const precomputedRushed = initialProcessed.slice(0, 25).map(item => ({
     ...item,
     duration: 30 + Math.random() * 15
}));

const RushedMode = () => {
  const [news, setNews] = useState(precomputedRushed);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        let rushedData = data.rushed && data.rushed.length > 0 ? data.rushed : initialRushedData;

        while (rushedData.length < 25) {
            rushedData = [...rushedData, ...rushedData];
        }
        
        const processed = rushedData.slice(0, 25).map(item => ({
             ...item,
             duration: 30 + Math.random() * 15
        }));
        setNews(processed);
      })
      .catch((err) => {
        console.error("Error fetching news, keeping initial optimistic data:", err);
      });
  }, []);

  return (
    <div className="screen rushed-mode">
      <Header darkMode={true} />
      <div className="rushed-content">
        <div className="marquee-container">
          {news.map((item, index) => (
            <NewsRow key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RushedMode;
