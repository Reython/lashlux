import { motion } from 'framer-motion';

const LETTERS = 'LashLux Studio'.split('');
const SUBTITLE = 'Ресницы, которыми восхищаются';

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: i * 0.03 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }),
};

export function Hero() {
  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* SVG Grain Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Hero image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        filter: 'sepia(0.1) saturate(1.2)',
      }} />

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        opacity: 0.06,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 70%, rgba(16,5,8,0.95) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 900 }}>

        {/* Pre-label */}
        <motion.p
          className="subheading"
          style={{ marginBottom: 24, letterSpacing: '0.3em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Москва · Таганская · Мастер Виктория
        </motion.p>

        {/* H1 — split letter animation */}
        <h1 style={{
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          perspective: 800,
        }}>
          {LETTERS.map((l, i) =>
            l === ' '
              ? <span key={i} style={{ width: '0.35em' }} />
              : (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="gold-text"
                  style={{ display: 'inline-block' }}
                >
                  {l}
                </motion.span>
              )
          )}
        </h1>

        {/* H2 subtitle */}
        <motion.h2
          style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontStyle: 'italic', color: 'var(--text)', fontWeight: 400, marginBottom: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          «{SUBTITLE}»
        </motion.h2>

        {/* Description */}
        <motion.p
          style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px', fontWeight: 300 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Наращивание с сохранением ваших ресниц.<br />
          Эффект держится 3–4 недели. Мастер с 6-летним опытом.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="#booking"
            className="btn-gold"
            style={{ fontSize: '0.8rem', padding: '16px 44px' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Записаться к Виктории
          </motion.a>
          <motion.a
            href="#portfolio"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', color: 'var(--text-muted)',
              fontFamily: "'Didact Gothic', sans-serif", fontSize: '0.75rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            whileHover={{ color: 'var(--gold)' } as any}
          >
            Смотреть работы ↓
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
      >
        <motion.div
          style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto' }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
