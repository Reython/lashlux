import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: 'var(--gold)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div className="subheading" style={{ marginTop: 6, fontSize: '0.65rem' }}>{label}</div>
    </div>
  );
}

const CERTS = [
  { id: 1, label: 'Международный сертификат по классике' },
  { id: 2, label: 'Объёмное наращивание' },
  { id: 3, label: 'Курс Mega Volume 2022' },
  { id: 4, label: 'Ламинирование 2023' },
  { id: 5, label: 'Повышение квалификации 2024' },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section" ref={ref} style={{ overflow: 'hidden' }}>
      <style>{`
        .about-layout {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; align-items: center;
        }
        .about-photo {
          width: 100%; height: 700px;
          object-fit: cover; object-position: top center;
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
          display: block;
        }
        .about-photo-wrap { position: relative; }
        .about-photo-wrap::after {
          content: ''; position: absolute; inset: 0;
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
          background: linear-gradient(to right, transparent 60%, var(--bg) 100%),
                      linear-gradient(to top, var(--bg) 0%, transparent 30%);
        }
        .about-content { padding: 48px 48px 48px 64px; }
        .cert-strip { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-top: 16px; }
        .cert-strip::-webkit-scrollbar { height: 2px; }
        .cert-strip::-webkit-scrollbar-thumb { background: var(--gold); }
        .cert-card {
          flex-shrink: 0; min-width: 150px; background: var(--glass);
          border: 1px solid var(--glass-border); border-radius: 8px;
          padding: 14px; cursor: pointer; transition: border-color 0.3s, transform 0.3s;
        }
        .cert-card:hover { border-color: var(--gold); transform: translateY(-4px); }
        @media (max-width: 768px) {
          .about-layout { grid-template-columns: 1fr; }
          .about-photo { height: 350px; border-radius: var(--radius-lg); }
          .about-photo-wrap::after { border-radius: var(--radius-lg); }
          .about-content { padding: 32px 24px; }
        }
      `}</style>

      <div className="container">
        <div className="about-layout">
          <motion.div className="about-photo-wrap"
            initial={{ x: -60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/victoria.png" alt="Виктория Иванова — мастер по ресницам" className="about-photo" />
          </motion.div>

          <motion.div className="about-content"
            initial={{ x: 60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label"><span className="subheading">О мастере</span></div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Виктория<br />Иванова</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 440, fontWeight: 300, marginBottom: 36 }}>
              Сертифицированный мастер с шестилетним стажем. Работаю с корейскими материалами
              премиум-класса. Индивидуальный подход к форме и длине.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 36 }}>
              <Stat value={6} suffix=" лет" label="Опыт" />
              <Stat value={1200} suffix="+" label="Клиенток" />
              <Stat value={4} suffix=".97★" label="Рейтинг" />
            </div>

            <blockquote style={{
              borderLeft: '2px solid var(--gold)', paddingLeft: 20,
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32,
            }}>
              «Я не просто наращиваю ресницы. Я создаю образ, который живёт с вами каждое утро.»
            </blockquote>

            <p className="subheading" style={{ marginBottom: 8 }}>Сертификаты</p>
            <div className="cert-strip">
              {CERTS.map(cert => (
                <div key={cert.id} className="cert-card">
                  <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>🏆</div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cert.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
