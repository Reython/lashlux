import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'О Виктории', href: '#about' },
  { label: 'Услуги', href: '#pricing' },
  { label: 'Отзывы', href: '#reviews' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px;
          transition: background 0.4s, padding 0.4s, backdrop-filter 0.4s;
        }
        .navbar--scrolled {
          background: rgba(16,5,8,0.92);
          backdrop-filter: blur(20px);
          padding: 16px 48px;
          border-bottom: 1px solid rgba(201,164,106,0.12);
        }
        .navbar__logo {
          font-family: 'Bodoni Moda', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: var(--gold);
          text-decoration: none;
          letter-spacing: 0.05em;
        }
        .navbar__logo span { color: var(--text); }
        .navbar__links {
          display: flex; gap: 36px; list-style: none;
        }
        .navbar__links a {
          font-family: 'Didact Gothic', sans-serif;
          font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--text-muted);
          text-decoration: none;
          transition: color 0.3s;
          position: relative;
        }
        .navbar__links a::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 1px; background: var(--gold);
          transform: scaleX(0); transition: transform 0.3s ease;
        }
        .navbar__links a:hover { color: var(--gold); }
        .navbar__links a:hover::after { transform: scaleX(1); }
        .navbar__cta {
          padding: 10px 24px; border: 1px solid var(--gold); color: var(--gold);
          font-family: 'Didact Gothic', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s;
          background: transparent;
        }
        .navbar__cta:hover { background: var(--gold); color: var(--bg); }
        .navbar__burger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        .navbar__burger span { display: block; width: 24px; height: 1px; background: var(--gold); margin: 5px 0; transition: all 0.3s; }
        .mobile-menu {
          position: fixed; inset: 0; background: rgba(16,5,8,0.97);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 32px; z-index: 999;
        }
        .mobile-menu a {
          font-family: 'Bodoni Moda', serif; font-style: italic;
          font-size: 2rem; color: var(--text); text-decoration: none;
        }
        .mobile-menu a:hover { color: var(--gold); }
        @media (max-width: 768px) {
          .navbar { padding: 20px 24px; }
          .navbar--scrolled { padding: 14px 24px; }
          .navbar__links, .navbar__cta { display: none; }
          .navbar__burger { display: block; }
        }
      `}</style>

      <a href="#hero" className="navbar__logo">LashLux <span>Studio</span></a>

      <ul className="navbar__links">
        {navLinks.map(l => (
          <li key={l.href}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>

      <a href="#booking" className="navbar__cta">Записаться</a>

      <button className="navbar__burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
        <span /><span /><span />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="#booking" className="btn-gold" onClick={() => setMenuOpen(false)}>Записаться</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
