import { motion } from 'framer-motion';

const REVIEWS = [
  { id: 1, username: '@anastasia_msk', name: 'Анастасия К.', text: 'Виктория — настоящий профессионал! Ресницы держатся уже 4 недели, выгляжу идеально каждое утро. Безболезненно и очень аккуратно.', stars: 5, date: '15 апр 2026' },
  { id: 2, username: '@margo_beauty', name: 'Марго Р.', text: 'Пришла с кривыми ресницами от другого мастера — Виктория сотворила чудо! Теперь только к ней. 3D Volume — это огонь 🔥', stars: 5, date: '10 апр 2026' },
  { id: 3, username: '@alina_k_style', name: 'Алина К.', text: 'Лучший мастер Москвы! Уже третий год хожу. Никогда не было аллергии, ресницы не выпадают, результат всегда идеальный.', stars: 5, date: '4 апр 2026' },
  { id: 4, username: '@daria_taganskaya', name: 'Дарья М.', text: 'Записалась впервые — была очень нервная. Но Виктория всё объяснила, было совсем не больно. Mega Volume — я влюблена!', stars: 5, date: '28 мар 2026' },
  { id: 5, username: '@sofi_lash', name: 'София Т.', text: 'Студия уютная, атмосфера расслабляющая. Виктория делала всё бережно и аккуратно. Мои натуральные ресницы целые и здоровые!', stars: 5, date: '21 мар 2026' },
  { id: 6, username: '@lena_moskva', name: 'Елена В.', text: 'Нюдовые ресницы — это именно то, что я искала! Выгляжу ухоженно без макияжа. Подруги думают, что это мои натуральные.', stars: 5, date: '15 мар 2026' },
];

const MARQUEE_ITEMS = [
  '⭐⭐⭐⭐⭐ "Лучший мастер Москвы" — Алина К.',
  '⭐⭐⭐⭐⭐ "Виктория — волшебница" — Марго Р.',
  '⭐⭐⭐⭐⭐ "Ресницы держатся 4 недели!" — Анастасия К.',
  '⭐⭐⭐⭐⭐ "Mega Volume — я влюблена!" — Дарья М.',
  '⭐⭐⭐⭐⭐ "Уже 3 года только к Виктории" — Алина К.',
  '⭐⭐⭐⭐⭐ "Безболезненно и идеально" — София Т.',
];

function Stars({ n }: { n: number }) {
  return <span style={{ color: '#C9A46A', letterSpacing: 2 }}>{'★'.repeat(n)}</span>;
}

export function Reviews() {
  return (
    <section id="reviews" className="section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, #140810 100%)', overflow: 'hidden' }}>
      <style>{`
        .marquee-wrap { overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 14px 0; margin-bottom: 64px; }
        .marquee-track { display: flex; gap: 48px; width: max-content; animation: marquee 28s linear infinite; white-space: nowrap; }
        .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-item { font-family: 'Raleway', sans-serif; font-size: 0.82rem; color: var(--text-muted); }
        .review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 60px; }
        .review-card {
          background: rgba(255,242,248,0.03); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .review-card:hover { border-color: rgba(201,164,106,0.35); transform: translateY(-4px); }
        .review-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .review-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--rose-dark), var(--gold));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem; color: var(--bg); flex-shrink: 0;
        }
        .review-username { font-size: 0.78rem; color: var(--text-muted); }
        .review-text { font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; margin: 10px 0; font-weight: 300; }
        .review-date { font-size: 0.72rem; color: rgba(255,242,248,0.3); }
        .map-wrap { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); }
        @media (max-width: 900px) { .review-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .review-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="container">
        <div className="section-label"><span className="subheading">Отзывы клиенток</span></div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 48 }}>О нас говорят</h2>
      </div>

      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Review cards */}
        <div className="review-grid">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.id} className="review-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}>
              <div className="review-head">
                <div className="review-avatar">{r.name[0]}</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{r.name}</div>
                  <div className="review-username">{r.username}</div>
                </div>
              </div>
              <Stars n={r.stars} />
              <p className="review-text">«{r.text}»</p>
              <p className="review-date">{r.date}</p>
            </motion.div>
          ))}
        </div>

        {/* Yandex Map */}
        <div className="map-wrap">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.651&z=16&pt=37.6512,55.7447,pm2rdm~37.6512,55.7447,pm2rdm&text=Воронцово+Поле+12+Москва"
            width="100%" height="400" style={{ border: 'none', display: 'block', filter: 'saturate(0.7) brightness(0.8)' }}
            title="LashLux Studio на карте"
            loading="lazy"
          />
        </div>

        {/* Bottom contact strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', alignItems: 'center', marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Телефон', val: '+7 (909) 633-14-27', href: 'tel:+79096331427' },
            { label: 'Email', val: 'vika@lashlux-studio.ru', href: 'mailto:vika@lashlux-studio.ru' },
            { label: 'Адрес', val: 'Воронцово Поле ул., 12 (м. Таганская)', href: '#' },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center' }}>
              <p className="subheading" style={{ marginBottom: 4 }}>{c.label}</p>
              <a href={c.href} style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.95rem' }}>{c.val}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
