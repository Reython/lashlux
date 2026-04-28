export function Footer() {
  return (
    <footer style={{
      background: '#080306',
      borderTop: '1px solid var(--border)',
      padding: '48px 0 32px',
    }}>
      <style>{`
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px;
          margin-bottom: 48px;
        }
        .footer-logo {
          font-family: 'Bodoni Moda', serif; font-style: italic;
          font-size: 1.6rem; color: var(--gold); margin-bottom: 12px;
          display: block;
        }
        .footer-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.8; max-width: 280px; }
        .footer-col-title { font-family: 'Didact Gothic', sans-serif; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: var(--text-muted); text-decoration: none; font-size: 0.88rem; transition: color 0.3s; }
        .footer-links a:hover { color: var(--gold); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); gap: 16px; flex-wrap: wrap; }
        .footer-bottom p { color: rgba(255,242,248,0.25); font-size: 0.75rem; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="footer-logo">LashLux Studio</span>
            <p className="footer-desc">«Ресницы, которыми восхищаются» — профессиональное наращивание ресниц в Москве. Мастер Виктория Иванова с 6-летним опытом.</p>
          </div>
          <div>
            <p className="footer-col-title">Навигация</p>
            <ul className="footer-links">
              {[['#portfolio','Портфолио'],['#about','О Виктории'],['#pricing','Услуги и цены'],['#reviews','Отзывы'],['#booking','Записаться']].map(([h,l]) => (
                <li key={h}><a href={h}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Контакты</p>
            <ul className="footer-links">
              <li><a href="tel:+79096331427">+7 (909) 633-14-27</a></li>
              <li><a href="mailto:vika@lashlux-studio.ru">vika@lashlux-studio.ru</a></li>
              <li><a href="#reviews">Воронцово Поле ул., 12</a></li>
              <li><a href="#reviews">м. Таганская, Москва</a></li>
            </ul>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['Instagram','VK','Telegram'].map(s => (
                <a key={s} href="#" style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--gold)'; (e.target as HTMLElement).style.color = 'var(--gold)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 LashLux Studio. Все права защищены.</p>
          <p style={{ color: 'var(--gold)', fontSize: '0.75rem', opacity: 0.6 }}>Москва · м. Таганская</p>
        </div>
      </div>
    </footer>
  );
}
