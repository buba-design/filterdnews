import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import monkeyBg from '../../../assets/monkey_bg.png';
import './Animals.css';

const fallbackAnimals = [
  {
    title: 'Penguins Pringle And Widget Bring A Lot Of Joy',
    url: 'https://www.bbc.com/news/articles/czdy4dw1n0po',
  },
  {
    title: 'Marwell Zoo Still Searching For Capybara Samba',
    url: 'https://www.bbc.com/news/articles/c3gg88vzll7o',
  },
  {
    title: 'Scientists Filmed A Whale Birth And Found Something Amazing',
    url: 'https://www.nationalgeographic.com/animals/article/scientists-filmed-a-whale-birth-and-found-something-amazing',
  },
  {
    title: 'This Fish Has Cloned Itself For 100000 Years',
    url: 'https://www.nationalgeographic.com/animals/article/this-fish-has-cloned-itself-for-100000-years',
  },
];

function wrapToLines(text, maxCharsPerLine = 14) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines = [];
  let line = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const w = words[i];
    const candidate = `${line} ${w}`.trim();
    if (candidate.length > maxCharsPerLine) {
      lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

export default function AnimalsMode() {
  const [items, setItems] = useState(fallbackAnimals);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const animals = Array.isArray(data?.animals) ? data.animals : [];
        const validAnimals = animals.filter(
          (item) => item && typeof item.url === 'string' && item.url && item.url !== '#',
        );

        if (validAnimals.length > 0) {
          // Keep enough items for cycling without crowding the UI.
          setItems(validAnimals.slice(0, 20));
          setIndex(0);
        } else {
          // Fall back to curated BBC / NatGeo animal stories.
          setItems(fallbackAnimals);
          setIndex(0);
        }
      })
      .catch(() => {
        // Keep fallback content if the API is unreachable.
      });
  }, []);

  const current = items[index % items.length] || fallbackAnimals[0];

  const signText = useMemo(() => {
    const title = (current?.title || '').toUpperCase();
    const lines = wrapToLines(title, 14);
    return lines.join('\n');
  }, [current]);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="animals-page" style={{ backgroundImage: `url(${monkeyBg})` }}>
      <Header />

      <div className="animals-sign">
        <div className="animals-sign-text">{signText}</div>

        <a
          className="animals-see-more"
          href={current?.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          SEE MORE
        </a>
      </div>

      <div className="animals-arrows">
        <button className="animals-arrow" type="button" onClick={goPrev} aria-label="Previous">
          ←
        </button>
        <button className="animals-arrow" type="button" onClick={goNext} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}

