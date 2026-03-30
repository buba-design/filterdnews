import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';

// Helper to convert hex to HSL for dynamic shading
const hexToHsl = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
};

const Relaxed = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  
  const [news, setNews] = useState([]);
  const [bodiesData, setBodiesData] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const hoveredIdRef = useRef(null);
  const [bgColor, setBgColor] = useState('#bff4ff');

  const handleMouseEnter = (id) => {
      setHoveredId(id);
      hoveredIdRef.current = id;
      
      setBgColor(prev => {
          const colors = ['#bff4ff', '#e6fffa', '#fff0f5', '#fffbc8', '#f0e6ff', '#e6f0ff', '#ffe6e6', '#e6ffe6'];
          const availableColors = colors.filter(c => c !== prev);
          return availableColors[Math.floor(Math.random() * availableColors.length)];
      });
  };
  const handleMouseLeave = () => {
      setHoveredId(null);
      hoveredIdRef.current = null;
  };

  useEffect(() => {
    // Fetch data
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`)
      .then(res => res.json())
      .then(data => {
        if (data && data.relaxed) {
          // Limit to exactly 10 for better breathing room
          setNews(data.relaxed.slice(0, 10));
        }
      })
      .catch(err => {
        console.error("Fetch failed", err);
        setNews([
          { title: "PUBLIC LIBRARIES SEE RENEWED INTEREST", summary: "Communities rediscovering libraries." },
          { title: "JAPAN EXPANDS URBAN GREENERY", summary: "Japan announced new initiatives to increase rooftop gardens and city trees" },
          { title: "MORE BIKE-FRIENDLY ZONES IN CITIES", summary: "Major metropolitan areas converting roads." },
          { title: "EU SUPPORTS SUSTAINABLE FARMING", summary: "Grants for regenerative agriculture." }
        ]);
      });
  }, []);

  useEffect(() => {
    if (!sceneRef.current || news.length === 0) return;

    // Matter.js Module Aliases
    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

    // Setup Engine & World
    // Disable gravity for floating bubbles
    const engine = Engine.create({
        gravity: { x: 0, y: 0 }
    });
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create solid walls to bounce off of instead of wrapping
    const wallOptions = { isStatic: true, restitution: 1.0, friction: 0 };
    const walls = [
        Bodies.rectangle(width / 2, -50, width * 2, 100, wallOptions), // Top
        Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions), // Bottom
        Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions), // Left
        Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions) // Right
    ];
    World.add(world, walls);

    // Create bubbles
    const bubbles = [];
    const createdBodies = [];

    news.forEach((item, index) => {
        // Base size (120px radius = 240px diameter)
        const baseRadius = 120;
        
        // Expanded hover size (480px diameter)
        const expandedSize = 480;

        // Random start position away from edges
        const x = 100 + Math.random() * (width - 200);
        const y = 100 + Math.random() * (height - 200);

        const body = Bodies.circle(x, y, baseRadius, {
            id: index, 
            restitution: 1.0, // High bounciness
            frictionAir: 0.002, // Lower air friction for longer drifts
            friction: 0.001,
            collisionFilter: { group: index }, // Optional: prevent self-overlap if needed
            render: { visible: false } 
        });

        // Give them a slightly faster initial drift to overcome initial overlaps
        Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 2.0,
            y: (Math.random() - 0.5) * 2.0
        });

        bubbles.push(body);
        createdBodies.push({
            id: index,
            item: item,
            body: body,
            baseRadius: baseRadius,
            expandedSize: expandedSize,
            position: { x, y },
            // Each bubble gets a unique hue offset (spread evenly across 360°)
            hueOffset: (index * 36) % 360,
            lightnessProfile: 82 + Math.random() * 6
        });
    });

    World.add(world, bubbles);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBodiesData([...createdBodies]);

    // Setup Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync positions on every tick
    Events.on(engine, 'afterUpdate', () => {
        const hovered = hoveredIdRef.current;

        // Smoothly scale physics bodies to match visual expansion
        bubbles.forEach(b => {
             const data = createdBodies[b.id];
             const expandedScale = data.expandedSize / (data.baseRadius * 2);
             const targetScale = (b.id === hovered) ? expandedScale : 1.0;
             const currentScale = b.customScale || 1.0;
             
             const diff = targetScale - currentScale;
             if (Math.abs(diff) > 0.01) {
                 // Smoothly interpolate. 0.1 per tick creates a ~300ms easing curve.
                 const step = diff * 0.1; 
                 const newScale = currentScale + step;
                 const factor = newScale / currentScale;
                 
                 Matter.Body.scale(b, factor, factor);
                 b.customScale = newScale;
             }
        });

        setBodiesData(prev => 
            prev.map(b => ({
                ...b,
                position: { x: b.body.position.x, y: b.body.position.y }
            }))
        );

        // Cap velocities so they don't go too fast or stop completely
        bubbles.forEach(b => {
             const speed = Matter.Vector.magnitude(b.velocity);
             if (speed > 1.0) {
                 Matter.Body.setVelocity(b, Matter.Vector.mult(Matter.Vector.normalise(b.velocity), 1.0));
             } else if (speed < 0.2) {
                 Matter.Body.applyForce(b, b.position, {
                     x: (Math.random() - 0.5) * 0.001,
                     y: (Math.random() - 0.5) * 0.001
                 });
             }
        });
    });

    // Handle Window Resize 
    // Usually MatterWrap bounds need updating if window changes but keeping simple for now.
    
    return () => {
      // Render.stop(render); // if used
      Matter.Runner.stop(runner);
      Engine.clear(engine);
      if (sceneRef.current) {
         sceneRef.current.innerHTML = '';
      }
    };
  }, [news]);


  // Compute dynamic button color matching the current pastel scheme
  const [baseH, baseS] = hexToHsl(bgColor);
  const headerButtonColor = `hsl(${baseH}, ${baseS}%, 70%)`;

  return (
    <div 
        style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: bgColor,
            transition: 'background-color 0.8s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <Header buttonColor={headerButtonColor} />

        {/* Matter.js Debug Canvas Container */}
        <div ref={sceneRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />

        {/* React Overlays */}
        {bodiesData.map((d) => {
            const [baseH] = hexToHsl(bgColor);
            // Rotate the background hue by each bubble's unique offset for distinct pastels
            const bubbleHue = (baseH + d.hueOffset) % 360;
            const l = d.lightnessProfile;
            const bubbleColor = `hsla(${bubbleHue}, 55%, ${l}%, 0.72)`;
            const textColor = '#2a2a2a';
            const subTextColor = '#555555';

            return (
                <motion.div
                    key={d.id}
                onMouseEnter={() => handleMouseEnter(d.id)}
                onMouseLeave={handleMouseLeave}
                initial={{ scale: 0 }}
                animate={{
                    width: hoveredId === d.id ? d.expandedSize : d.baseRadius * 2,
                    height: hoveredId === d.id ? d.expandedSize : d.baseRadius * 2,
                    scale: 1,
                    boxShadow: hoveredId === d.id ? '0px 15px 40px rgba(0,0,0,0.1)' : '0px 4px 15px rgba(0,0,0,0.02)'
                }}
                transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 25,
                    scale: { delay: d.id * 0.03, type: 'spring', stiffness: 300, damping: 20 }
                }}
                style={{
                    position: 'absolute',
                    top: d.position.y,
                    left: d.position.x,
                    x: '-50%',
                    y: '-50%',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.8)',
                    backgroundColor: bubbleColor,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'background-color 0.8s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // The magic safe-zone: since a square fits inside a circle at 70.7% (sqrt 2)
                    // we use a narrower container for the text to prevent curve clipping
                    padding: '0',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    zIndex: hoveredId === d.id ? 100 : 1
                }}
            >
                {/* Slightly larger safe-zone (78%) for the bigger font */}
                <div style={{ width: '78%', height: '78%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <motion.h3
                        animate={{
                            fontSize: hoveredId === d.id ? '1.05rem' : '0.8rem',
                            marginBottom: hoveredId === d.id ? 6 : 0
                        }}
                        style={{
                            fontWeight: '700',
                            color: textColor,
                            margin: 0,
                            textAlign: 'center',
                            lineHeight: '1.25',
                            // Title should fit even if not hovered
                            display: '-webkit-box',
                            WebkitLineClamp: hoveredId === d.id ? 3 : 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {d.item.title}
                    </motion.h3>

                    <AnimatePresence>
                        {hoveredId === d.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    width: '100%'
                                }}
                            >
                                <p style={{
                                    fontSize: '0.86rem',
                                    color: subTextColor,
                                    lineHeight: '1.35',
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {d.item.summary}
                                </p>
                                {d.item.url && d.item.url !== '#' && (
                                    <a 
                                        href={d.item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '8px 18px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: '30px',
                                            color: textColor,
                                            textDecoration: 'none',
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                                    >
                                        Source
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            );
        })}
    </div>
  );
};

export default Relaxed;
