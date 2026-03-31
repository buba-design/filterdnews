import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Header from './Header';

const NewsRow = ({ item, index }) => {
  const flags = ['us', 'eu', 'fr', 'gb', 'ir', 'cn'];
  
  // Robustly handle common non-ISO AI responses
  let rawCode = item.countryCode ? item.countryCode.toLowerCase().trim() : flags[index % flags.length];
  const aliasMap = {
    'uk': 'gb',
    'usa': 'us',
    'eng': 'gb-eng',
    'un': 'eu' // Use EU flag for global "UN" news
  };
  const flagCode = aliasMap[rawCode] || rawCode;
  const flagUrl = `/small_flags/${flagCode} Small Small Small.jpeg`;

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
            e.target.src = '/small_flags/eu Small Small Small.jpeg'; 
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

const RushedMode = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        // Assume data returns { rushed: [...], relaxed: [...] }
        let rushedData = data.rushed && data.rushed.length > 0 ? data.rushed : [
          { "title": "CONSERVATIVES SPLIT OVER IRAN WAR", "summary": "A MAJOR DIVIDE HEATS UP", "countryCode": "us" },
          { "title": "RULE OF LAW CONCERNS RISING ACROSS EUROPE", "summary": "FAR-RIGHT IMMIGRATION PLANS", "countryCode": "eu" },
          { "title": "FEDERAL RESERVE LEADERSHIP BATTLE HEATS UP", "summary": "A SENATE SHOWDOWN EXPECTED", "countryCode": "us" },
          { "title": "NEW MAYOR OF PARIS TAKES OFFICE", "summary": "AMIDST ONGOING MASSIVE TRAFFIC CHAOS", "countryCode": "fr" },
          { "title": "MASSIVE 'NO KINGS' PROTESTS RESHAPE US POLITICS", "summary": "OVER 80,000 MARCH", "countryCode": "us" },
          { "title": "PROTESTS SIGNAL GROWING ANTI-GOVERNMENT SENTIMENT", "summary": "ACROSS THE NATION", "countryCode": "gb" },
          { "title": "AROUND 50,000 PEOPLE MARCHED IN LONDON", "summary": "OPPOSING THE NEW ECONOMIC BILL", "countryCode": "gb" },
          { "title": "MARKET WATCH: TECH STOCKS RALLY", "summary": "NEW INNOVATIONS SPARK INVESTOR OPTIMISM", "countryCode": "us" },
          { "title": "CLIMATE NEGOTIATIONS STALL", "summary": "INTERNATIONAL SUMMIT ENDS WITHOUT MAJOR AGREEMENT", "countryCode": "de" },
          { "title": "GLOBAL SUPPLY CHAINS DISRUPTED", "summary": "MAJOR PORTS SEE RECORD DELAYS", "countryCode": "cn" }
        ];

        // Ensure we duplicate enough rows to completely cover large screens
        while (rushedData.length < 25) {
            rushedData = [...rushedData, ...rushedData];
        }
        
        const processed = rushedData.slice(0, 25).map(item => ({
             ...item,
             duration: 30 + Math.random() * 15
        }));
        setNews(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        const fallback = [
          { "title": "CONSERVATIVES SPLIT OVER IRAN WAR", "summary": "A MAJOR DIVIDE HEATS UP", "countryCode": "us" },
          { "title": "RULE OF LAW CONCERNS RISING ACROSS EUROPE", "summary": "FAR-RIGHT IMMIGRATION PLANS", "countryCode": "eu" },
          { "title": "FEDERAL RESERVE LEADERSHIP BATTLE HEATS UP", "summary": "A SENATE SHOWDOWN EXPECTED", "countryCode": "us" }
        ];
        
        let repeatedFallback = [...fallback];
        while (repeatedFallback.length < 25) {
           repeatedFallback = [...repeatedFallback, ...fallback];
        }
        
        setNews(repeatedFallback.slice(0, 25).map(item => ({ ...item, duration: 30 + Math.random() * 15 })));
        setLoading(false);
      });
  }, []);

  return (
    <div className="screen rushed-mode">
      <Header darkMode={true} />
      <div className="rushed-content">
        {loading ? (
          <div className="loading-rushed">LOADING DATA...</div>
        ) : (
          <div className="marquee-container">
            {news.map((item, index) => (
              <NewsRow key={index} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RushedMode;
