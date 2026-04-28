import { useEffect, useState } from 'react';

export function StickyMobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        .sticky-bar {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
          background: linear-gradient(135deg, #1a0910 0%, #2a1020 100%);
          border-top: 1px solid rgba(201,164,106,0.3);
          padding: 14px 20px;
          align-items: center; justify-content: space-between;
          gap: 12px;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sticky-bar--visible { transform: translateY(0); }
        .sticky-bar__text {
          font-family: 'Raleway', sans-serif;
          font-size: 0.8rem;
          color: var(--text);
        }
        .sticky-bar__text span { color: var(--gold); font-weight: 500; }
        .sticky-bar__btn {
          padding: 10px 20px;
          background: var(--gold);
          color: var(--bg);
          font-family: 'Didact Gothic', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .sticky-bar { display: flex; }
        }
      `}</style>
      <div className={`sticky-bar ${visible ? 'sticky-bar--visible' : ''}`}>
        <p className="sticky-bar__text">🤍 Первый визит <span>-15%</span></p>
        <a href="#booking" className="sticky-bar__btn">Записаться →</a>
      </div>
    </>
  );
}
