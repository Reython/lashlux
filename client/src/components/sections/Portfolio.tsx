import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { PortfolioItem } from '../../types';

const CATEGORIES = ['Все', 'Классика', '2D Volume', '3D Volume', 'Mega Volume', 'Цветные', 'Нюдовые'];

// Portfolio items — 3 real images + 9 CSS gradient placeholders
const PORTFOLIO: PortfolioItem[] = [
  { id: 1, src: '/p1.png', thumb: '/p1.png', category: 'Классика', type: 'Классика', bundles: 80, duration: '2 часа', price: '3 000 ₽' },
  { id: 2, src: '/p2.png', thumb: '/p2.png', category: '3D Volume', type: '3D Volume', bundles: 120, duration: '2.5 часа', price: '4 200 ₽' },
  { id: 3, src: '/p3.png', thumb: '/p3.png', category: 'Mega Volume', type: 'Mega Volume', bundles: 160, duration: '3 часа', price: '5 500 ₽' },
  { id: 4, src: '/p1.png', thumb: '/p1.png', category: '2D Volume', type: '2D Volume', bundles: 100, duration: '2.5 часа', price: '3 500 ₽' },
  { id: 5, src: '/p2.png', thumb: '/p2.png', category: 'Цветные', type: 'Цветные', bundles: 120, duration: '2.5 часа', price: '4 500 ₽' },
  { id: 6, src: '/p3.png', thumb: '/p3.png', category: 'Нюдовые', type: 'Нюдовые', bundles: 90, duration: '2 часа', price: '4 000 ₽' },
  { id: 7, src: '/p2.png', thumb: '/p2.png', category: 'Классика', type: 'Классика', bundles: 80, duration: '2 часа', price: '3 000 ₽' },
  { id: 8, src: '/p1.png', thumb: '/p1.png', category: 'Mega Volume', type: 'Mega Volume', bundles: 180, duration: '3 часа', price: '5 500 ₽' },
  { id: 9, src: '/p3.png', thumb: '/p3.png', category: '3D Volume', type: '3D Volume', bundles: 130, duration: '2.5 часа', price: '4 200 ₽' },
  { id: 10, src: '/p2.png', thumb: '/p2.png', category: '2D Volume', type: '2D Volume', bundles: 110, duration: '2.5 часа', price: '3 500 ₽' },
  { id: 11, src: '/p1.png', thumb: '/p1.png', category: 'Нюдовые', type: 'Нюдовые', bundles: 85, duration: '2 часа', price: '4 000 ₽' },
  { id: 12, src: '/p3.png', thumb: '/p3.png', category: 'Цветные', type: 'Цветные', bundles: 130, duration: '2.5 часа', price: '4 500 ₽' },
];

// CSS gradient placeholders for items without real images
const GRADIENTS = [
  'linear-gradient(135deg, #1a0812 0%, #3d1030 50%, #2a0818 100%)',
  'linear-gradient(145deg, #0d0510 0%, #2b0d35 50%, #1a0828 100%)',
  'linear-gradient(125deg, #120610 0%, #3a1525 50%, #1c0a14 100%)',
  'linear-gradient(155deg, #0a0508 0%, #281020 60%, #160812 100%)',
  'linear-gradient(135deg, #150818 0%, #3c1232 55%, #200b1a 100%)',
  'linear-gradient(145deg, #0e0610 0%, #2d0f38 50%, #190a22 100%)',
  'linear-gradient(130deg, #130810 0%, #3a1228 50%, #1e0c18 100%)',
  'linear-gradient(150deg, #0d0608 0%, #2a1020 50%, #160a12 100%)',
  'linear-gradient(125deg, #151010 0%, #3c1820 50%, #1e0e14 100%)',
];

const breakpointCols = { default: 3, 1024: 3, 768: 2, 480: 1 };

export function Portfolio() {
  const [active, setActive] = useState('Все');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = active === 'Все' ? PORTFOLIO : PORTFOLIO.filter(p => p.category === active);
  const lightboxSlides = filtered.filter(p => p.src).map(p => ({ src: p.src }));

  return (
    <section id="portfolio" className="section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, #140810 50%, var(--bg) 100%)' }}>
      <style>{`
        .portfolio-tab {
          position: relative;
          padding: 8px 0;
          background: none; border: none; cursor: pointer;
          font-family: 'Didact Gothic', sans-serif;
          font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.3s;
        }
        .portfolio-tab.active { color: var(--gold); }
        .portfolio-tab:hover { color: var(--text); }
        .portfolio-card {
          position: relative; overflow: hidden; cursor: pointer;
          border-radius: 8px;
        }
        .portfolio-card img, .portfolio-card .grad-bg {
          width: 100%; display: block;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .portfolio-card .grad-bg {
          aspect-ratio: 3/4;
          display: flex; align-items: center; justify-content: center;
        }
        .portfolio-card:hover img,
        .portfolio-card:hover .grad-bg { transform: scale(1.04); }
        .portfolio-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(16,5,8,0.95) 0%, rgba(16,5,8,0.4) 60%, transparent 100%);
          opacity: 0; transition: opacity 0.3s; display: flex;
          flex-direction: column; justify-content: flex-end; padding: 20px;
        }
        .portfolio-card:hover .portfolio-overlay { opacity: 1; }
        .yarl__root { --yarl__color_backdrop: rgba(10,3,6,0.97); }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="section-label"><span className="subheading">Галерея</span></div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 40 }}>Работы Виктории</h2>

        {/* Filter tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 48, position: 'relative', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {CATEGORIES.map(cat => (
            <div key={cat} style={{ position: 'relative', paddingBottom: 12 }}>
              <button className={`portfolio-tab ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>
                {cat}
              </button>
              {active === cat && (
                <motion.div layoutId="tab-underline" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 1, background: 'var(--gold)',
                  boxShadow: '0 0 8px var(--gold)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Masonry breakpointCols={breakpointCols} className="masonry-grid" columnClassName="masonry-grid-col">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="portfolio-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  onHoverStart={() => setHovered(item.id)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => {
                    const realIdx = filtered.findIndex(f => f.id === item.id && f.src);
                    if (realIdx !== -1) setLightboxIndex(realIdx);
                  }}
                >
                  {item.src ? (
                    <img src={item.src} alt={`${item.type} — ${item.bundles} пучков`} loading="lazy"
                      style={{ width: '100%', display: 'block', aspectRatio: i % 3 === 1 ? '3/4' : '4/5' }}
                    />
                  ) : (
                    <div className="grad-bg" style={{
                      background: GRADIENTS[i % GRADIENTS.length],
                      aspectRatio: i % 3 === 1 ? '3/4' : '4/5',
                      position: 'relative',
                    }}>
                      {/* Decorative lash SVG hint */}
                      <svg viewBox="0 0 80 30" style={{ width: 80, opacity: 0.25 }}>
                        {[0,6,12,18,24,30,36].map((x, j) => (
                          <line key={j} x1={x+5} y1={28} x2={x+2 + (j%2)*4} y2={2 + j%3*4}
                            stroke="#C9A46A" strokeWidth="1.5" strokeLinecap="round" />
                        ))}
                      </svg>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="portfolio-overlay">
                    <p className="subheading" style={{ marginBottom: 4 }}>{item.type}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                      {item.bundles} пучков · {item.duration}
                    </p>
                    <a href="#booking" className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.65rem' }}
                      onClick={e => e.stopPropagation()}>
                      Хочу так же
                    </a>
                  </div>

                  {/* Caption bar */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(16,5,8,0.7)', backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border)', borderRadius: 4,
                    padding: '4px 10px',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.85rem', color: 'var(--gold)',
                    opacity: hovered === item.id ? 1 : 0,
                    transition: 'opacity 0.3s',
                  }}>
                    {item.price}
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxSlides}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(10,3,6,0.97)' } as any }}
      />
    </section>
  );
}
