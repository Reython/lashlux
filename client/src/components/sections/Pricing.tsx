import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SERVICES = {
  'Наращивание': [
    { name: 'Классика', time: '2 ч', price: 3000 },
    { name: '2D Volume', time: '2.5 ч', price: 3500 },
    { name: '3D Volume', time: '2.5 ч', price: 4200 },
    { name: 'Mega Volume', time: '3 ч', price: 5500 },
    { name: 'Цветные ресницы', time: '2.5 ч', price: 4500 },
    { name: 'Нюдовые ресницы', time: '2 ч', price: 4000 },
  ],
  'Коррекция': [
    { name: 'Коррекция классика', time: '1.5 ч', price: 2000 },
    { name: 'Коррекция объём', time: '1.5 ч', price: 2500 },
    { name: 'Коррекция Mega Volume', time: '2 ч', price: 3500 },
  ],
  'Снятие': [
    { name: 'Снятие (своя работа)', time: '30 мин', price: 0 },
    { name: 'Снятие (чужая работа)', time: '45 мин', price: 500 },
  ],
  'Ламинирование': [
    { name: 'Ламинирование ресниц', time: '1 ч', price: 2800 },
    { name: 'Ботокс для ресниц', time: '1 ч', price: 3200 },
  ],
};

const CATS = Object.keys(SERVICES);

export function Pricing() {
  const [activeTab, setActiveTab] = useState(CATS[0]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // IntersectionObserver for sticky tab sync
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveTab(e.target.id.replace('pricing-', '')); });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -50% 0px' }
    );
    CATS.forEach(cat => {
      const el = sectionRefs.current[cat];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, #160b12 100%)' }}>
      <style>{`
        .pricing-layout { display: grid; grid-template-columns: 220px 1fr; gap: 60px; align-items: start; }
        .pricing-tabs { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 4px; }
        .pricing-tab {
          padding: 12px 20px; background: none; border: none; cursor: pointer;
          font-family: 'Didact Gothic', sans-serif; font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--text-muted); text-align: left;
          border-left: 2px solid transparent; transition: all 0.3s;
        }
        .pricing-tab.active { color: var(--gold); border-left-color: var(--gold); background: var(--gold-glow); }
        .pricing-tab:hover:not(.active) { color: var(--text); border-left-color: rgba(201,164,106,0.3); }
        .price-table { width: 100%; border-collapse: collapse; }
        .price-row {
          position: relative; border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .price-row:hover { background: rgba(201,164,106,0.04); }
        .price-row.hovered td:first-child { border-left: 2px solid var(--gold); }
        .price-row td { padding: 18px 16px; vertical-align: middle; }
        .price-row td:first-child { padding-left: 20px; }
        .price-name { font-size: 0.95rem; font-weight: 400; }
        .price-time { color: var(--text-muted); font-size: 0.8rem; }
        .price-val {
          font-family: 'Cormorant Garamond', serif; font-size: 1.3rem;
          color: var(--gold); white-space: nowrap; text-align: right;
        }
        .price-cta {
          text-align: right; padding-right: 20px !important;
          opacity: 0; transition: opacity 0.2s;
        }
        .price-row:hover .price-cta { opacity: 1; }
        .pricing-cat-title {
          font-family: 'Bodoni Moda', serif; font-style: italic;
          font-size: 1.8rem; margin-bottom: 24px; padding-top: 8px;
        }
        .pricing-cat + .pricing-cat { margin-top: 60px; }
        @media (max-width: 768px) {
          .pricing-layout { grid-template-columns: 1fr; }
          .pricing-tabs { flex-direction: row; flex-wrap: wrap; position: static; gap: 8px; margin-bottom: 32px; }
          .pricing-tab { border-left: none; border-bottom: 2px solid transparent; padding: 8px 12px; }
          .pricing-tab.active { border-left: none; border-bottom-color: var(--gold); }
        }
      `}</style>

      <div className="container">
        <div className="section-label"><span className="subheading">Прайс-лист</span></div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 48 }}>Услуги и цены</h2>

        <div className="pricing-layout">
          {/* Sticky tabs */}
          <nav className="pricing-tabs">
            {CATS.map(cat => (
              <button key={cat} className={`pricing-tab ${activeTab === cat ? 'active' : ''}`}
                onClick={() => {
                  sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}>
                {cat}
              </button>
            ))}
            <div style={{ marginTop: 24, padding: '20px', background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <p className="subheading" style={{ marginBottom: 8 }}>Первый визит</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Скидка <span style={{ color: 'var(--gold)' }}>-15%</span> при бронировании онлайн.
              </p>
            </div>
          </nav>

          {/* Service categories */}
          <div>
            {CATS.map(cat => (
              <motion.div
                key={cat}
                id={`pricing-${cat}`}
                className="pricing-cat"
                ref={el => { sectionRefs.current[cat] = el; }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="pricing-cat-title">{cat}</h3>
                <table className="price-table">
                  <tbody>
                    {SERVICES[cat as keyof typeof SERVICES].map(svc => {
                      const key = `${cat}-${svc.name}`;
                      return (
                        <tr key={key} className={`price-row ${hoveredRow === key ? 'hovered' : ''}`}
                          onMouseEnter={() => setHoveredRow(key)}
                          onMouseLeave={() => setHoveredRow(null)}>
                          <td>
                            <div className="price-name">{svc.name}</div>
                            <div className="price-time">{svc.time}</div>
                          </td>
                          <td className="price-val">
                            {svc.price === 0 ? 'Бесплатно' : `${svc.price.toLocaleString('ru-RU')} ₽`}
                          </td>
                          <td className="price-cta">
                            <a href="#booking" className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.65rem' }}>
                              Записаться
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
