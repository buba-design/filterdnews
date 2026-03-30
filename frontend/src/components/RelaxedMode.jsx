import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Header from './Header';

const RelaxedMode = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example hardcoded positions to prevent full overlap for ~10 bubbles
  const bubblePositions = [
    { top: '15%', left: '10%' },
    { top: '25%', left: '35%' },
    { top: '10%', left: '55%' },
    { top: '20%', left: '80%' },
    { top: '50%', left: '15%' },
    { top: '45%', left: '60%' },
    { top: '70%', left: '80%' },
    { top: '80%', left: '15%' },
    { top: '75%', left: '40%' },
    { top: '60%', left: '65%' },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const processed = (data.relaxed || []).map(item => ({
             ...item,
             size: 200 + Math.random() * 80,
             duration: 8 + Math.random() * 5
        }));
        setNews(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="screen relaxed-mode">
      <Header />
      <div className="relaxed-content">
        {loading ? (
          <div className="loading-relaxed">Gathering peaceful thoughts...</div>
        ) : (
          news.map((item, index) => {
            const pos = bubblePositions[index % bubblePositions.length];

            return (
              <motion.div
                key={index}
                className="bubble"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: [0, 10, -10, 0],
                  y: [0, -15, 10, 0]
                }}
                transition={{
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                }}
              >
                <div className="bubble-text">
                  <h3>{item.title}</h3>
                  {item.summary && <p>{item.summary}</p>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RelaxedMode;
