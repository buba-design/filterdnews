import React, { useEffect, useState } from 'react';
import Header from './Header';

const RushedMode = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        // Assume data returns { rushed: [...], relaxed: [...] }
        const processed = (data.rushed || []).map(item => ({
             ...item,
             duration: 30 + Math.random() * 15
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
    <div className="screen rushed-mode">
      <Header darkMode={true} />
      <div className="rushed-content">
        {loading ? (
          <div className="loading-rushed">LOADING DATA...</div>
        ) : (
          <div className="marquee-container">
            {news.map((item, index) => (
              <div key={index} className={`marquee-row row-${index % 5}`}>
                <div className="marquee-content" style={{ animationDuration: `${item.duration}s` }}>
                  <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
                  <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
                  <span>{item.title.toUpperCase()}: {item.summary.toUpperCase()} • </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RushedMode;
