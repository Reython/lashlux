import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { fetchSlots, createAppointment } from '../../lib/api';

const SERVICES_LIST = [
  { id: 1, name: 'Классика', price: 3000, duration: 120, icon: '✦' },
  { id: 2, name: '2D Volume', price: 3500, duration: 150, icon: '✧' },
  { id: 3, name: '3D Volume', price: 4200, duration: 150, icon: '❋' },
  { id: 4, name: 'Mega Volume', price: 5500, duration: 180, icon: '✵' },
  { id: 5, name: 'Цветные', price: 4500, duration: 150, icon: '◈' },
  { id: 6, name: 'Нюдовые', price: 4000, duration: 150, icon: '◇' },
  { id: 7, name: 'Коррекция', price: 2500, duration: 100, icon: '↺' },
  { id: 12, name: 'Ламинирование', price: 2800, duration: 60, icon: '✿' },
];

const SOURCES = ['Instagram', 'Яндекс', 'ВКонтакте', 'Рекомендация подруги', 'Другое'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// Canvas sparkles
function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 2,
      life: 1, decay: 0.012 + Math.random() * 0.01,
      size: 2 + Math.random() * 4,
      hue: 35 + Math.random() * 20,
    }));
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay;
        if (p.life <= 0) {
          p.x = canvas.width / 2; p.y = canvas.height / 2;
          p.vx = (Math.random() - 0.5) * 6; p.vy = (Math.random() - 0.5) * 6 - 2;
          p.life = 1; p.size = 2 + Math.random() * 4;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue}, 80%, 65%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

export function Booking() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof SERVICES_LIST[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [firstVisit, setFirstVisit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  const goTo = useCallback((next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  // Fetch slots when date selected
  useEffect(() => {
    if (!selectedDate || !selectedService) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    setSlotsLoading(true);
    fetchSlots(dateStr, selectedService.duration)
      .then(r => setSlots(r.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedService]);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !name || !phone) {
      setError('Заполните все поля'); return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await createAppointment({
        service_id: selectedService.id,
        client_name: name, phone,
        client_source: source,
        appt_date: selectedDate.toISOString().split('T')[0],
        appt_time: selectedTime,
        is_first_visit: firstVisit,
      });
      setSuccess(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const disabledDays = [
    { before: new Date() },
    (d: Date) => d.getDay() === 1, // Monday off
  ];

  const finalPrice = selectedService
    ? firstVisit ? Math.round(selectedService.price * 0.85) : selectedService.price
    : 0;

  return (
    <section id="booking" className="section" style={{ background: 'linear-gradient(180deg, #160b12 0%, var(--bg) 100%)' }}>
      <style>{`
        .booking-wrap { max-width: 680px; margin: 0 auto; }
        .booking-card {
          background: rgba(255,242,248,0.02); border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg); overflow: hidden; position: relative; min-height: 460px;
        }
        .step-bar { display: flex; gap: 0; }
        .step-seg { flex: 1; height: 3px; background: var(--border); transition: background 0.4s; }
        .step-seg.done { background: var(--gold); }
        .step-inner { padding: 40px 48px; }
        .svc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .svc-card {
          padding: 20px; border: 1px solid var(--border); border-radius: 10px;
          cursor: pointer; transition: all 0.25s; background: transparent;
          text-align: left; color: var(--text);
        }
        .svc-card:hover { border-color: var(--gold); background: var(--gold-glow); }
        .svc-card.selected { border-color: var(--gold); background: var(--gold-glow); box-shadow: 0 0 20px var(--gold-glow); }
        .slot-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .slot-btn {
          padding: 12px 8px; border: 1px solid var(--border); border-radius: 6px;
          background: transparent; color: var(--text); cursor: pointer;
          font-family: 'Cormorant Garamond', serif; font-size: 1rem;
          transition: all 0.25s;
        }
        .slot-btn:hover { border-color: var(--gold); color: var(--gold); }
        .slot-btn.selected { background: var(--gold); color: var(--bg); border-color: var(--gold); }
        .form-field { margin-bottom: 20px; }
        .form-label { font-family: 'Didact Gothic', sans-serif; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .form-input {
          width: 100%; padding: 14px 16px; background: rgba(255,242,248,0.04);
          border: 1px solid var(--border); border-radius: 6px; color: var(--text);
          font-family: 'Raleway', sans-serif; font-size: 0.95rem; outline: none;
          transition: border-color 0.3s;
        }
        .form-input:focus { border-color: var(--gold); }
        .form-select { appearance: none; cursor: pointer; }
        .check-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .custom-check {
          width: 20px; height: 20px; border: 1px solid var(--border); border-radius: 4px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.25s;
        }
        .custom-check.checked { background: var(--gold); border-color: var(--gold); }
        .rdp { --rdp-accent-color: var(--gold) !important; --rdp-background-color: var(--gold-glow) !important; color: var(--text) !important; }
        .rdp-day_selected { background: var(--gold) !important; color: var(--bg) !important; }
        .rdp-day:hover:not(.rdp-day_disabled) { background: var(--gold-glow) !important; }
        .rdp-day_disabled { opacity: 0.25 !important; text-decoration: line-through; }
        .rdp-nav_button { color: var(--gold) !important; }
        .rdp-caption_label { font-family: 'Didact Gothic', sans-serif !important; color: var(--text) !important; }
        .success-screen { text-align: center; padding: 60px 40px; position: relative; overflow: hidden; min-height: 460px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        @media (max-width: 600px) {
          .step-inner { padding: 28px 24px; }
          .svc-grid { grid-template-columns: 1fr; }
          .slot-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="container">
        <div className="booking-wrap">
          <div className="section-label"><span className="subheading">Онлайн-запись</span></div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 8 }}>Записаться к Виктории</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontWeight: 300 }}>
            Ул. Воронцово Поле, 12 · м. Таганская · +7 (909) 633-14-27
          </p>

          <div className="booking-card">
            {!success ? (
              <>
                {/* Progress bar */}
                <div className="step-bar">
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`step-seg ${step >= s ? 'done' : ''}`} />
                  ))}
                </div>

                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div key={step} custom={dir}
                    variants={slideVariants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
                    className="step-inner"
                  >
                    {/* Step 1 — Service */}
                    {step === 1 && (
                      <div>
                        <p className="subheading" style={{ marginBottom: 20 }}>Шаг 1 / 4 — Выберите услугу</p>
                        <div className="svc-grid">
                          {SERVICES_LIST.map(svc => (
                            <button key={svc.id} className={`svc-card ${selectedService?.id === svc.id ? 'selected' : ''}`}
                              onClick={() => { setSelectedService(svc); goTo(2); }}>
                              <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{svc.icon}</div>
                              <div style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontSize: '1rem', marginBottom: 4 }}>{svc.name}</div>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)', fontSize: '1rem' }}>
                                {svc.price.toLocaleString('ru-RU')} ₽
                              </div>
                              {selectedService?.id === svc.id && (
                                <div style={{ position: 'absolute', top: 12, right: 12, color: 'var(--gold)' }}>✓</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2 — Date */}
                    {step === 2 && (
                      <div>
                        <p className="subheading" style={{ marginBottom: 20 }}>Шаг 2 / 4 — Выберите дату</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(d) => { setSelectedDate(d); setSelectedTime(''); if (d) goTo(3); }}
                            disabled={disabledDays as any}
                            weekStartsOn={1}
                          />
                        </div>
                        <button onClick={() => goTo(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', marginTop: 8 }}>
                          ← Назад
                        </button>
                      </div>
                    )}

                    {/* Step 3 — Time */}
                    {step === 3 && (
                      <div>
                        <p className="subheading" style={{ marginBottom: 20 }}>Шаг 3 / 4 — Выберите время</p>
                        {slotsLoading ? (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Загружаем доступные окна…</div>
                        ) : slots.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ color: 'var(--text-muted)' }}>На этот день нет свободных окон.</p>
                            <button className="btn-gold" style={{ marginTop: 16 }} onClick={() => goTo(2)}>Выбрать другую дату</button>
                          </div>
                        ) : (
                          <div className="slot-grid">
                            {slots.map(t => (
                              <button key={t} className={`slot-btn ${selectedTime === t ? 'selected' : ''}`}
                                onClick={() => { setSelectedTime(t); goTo(4); }}>
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                        <button onClick={() => goTo(2)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', marginTop: 20 }}>
                          ← Назад
                        </button>
                      </div>
                    )}

                    {/* Step 4 — Details */}
                    {step === 4 && (
                      <div>
                        <p className="subheading" style={{ marginBottom: 20 }}>Шаг 4 / 4 — Ваши данные</p>
                        <div style={{ background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {selectedService?.name} · {selectedDate?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · {selectedTime}
                        </div>
                        <div className="form-field">
                          <label className="form-label">Ваше имя</label>
                          <input className="form-input" placeholder="Анастасия" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Телефон</label>
                          <input className="form-input" placeholder="+7 (999) 000-00-00" value={phone}
                            onChange={e => setPhone(e.target.value)} type="tel" />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Откуда узнали о нас?</label>
                          <select className="form-input form-select" value={source} onChange={e => setSource(e.target.value)}>
                            <option value="">Выберите...</option>
                            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="check-row" onClick={() => setFirstVisit(v => !v)}>
                            <div className={`custom-check ${firstVisit ? 'checked' : ''}`}>
                              {firstVisit && <span style={{ color: 'var(--bg)', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                              Первый визит <span style={{ color: 'var(--gold)' }}>(скидка −15%)</span>
                            </span>
                          </label>
                        </div>

                        {firstVisit && (
                          <div style={{ background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Итого со скидкой:</span>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--gold)' }}>{finalPrice.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}

                        {error && <p style={{ color: '#e85d75', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <button onClick={() => goTo(3)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>← Назад</button>
                          <button className="btn-gold" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Записываю…' : 'Записаться ✨'}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <div className="success-screen">
                <SparkleCanvas />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>✨</div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{success.message}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--gold)' }}>{selectedDate?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}</strong> в <strong style={{ color: 'var(--gold)' }}>{selectedTime}</strong><br />
                    Ул. Воронцово Поле, 12 (м. Таганская)
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>SMS отправлено на {phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
