const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Stub: send Telegram message to Victoria
async function notifyTelegram(msg) {
  console.log('[TELEGRAM STUB] →', msg);
  // TODO: Replace with real bot token
  // const token = process.env.TELEGRAM_BOT_TOKEN;
  // const chatId = process.env.TELEGRAM_CHAT_ID;
  // await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
  // });
}

// Stub: send SMS to client
async function sendSms(phone, msg) {
  console.log(`[SMS STUB] → ${phone}: ${msg}`);
  // TODO: Replace with real SMS.ru API key
  // const apiKey = process.env.SMSRU_API_KEY;
  // await fetch(`https://sms.ru/sms/send?api_id=${apiKey}&to=${phone}&msg=${encodeURIComponent(msg)}&json=1`);
}

// POST /api/appointments/create
router.post('/create', (req, res) => {
  const {
    service_id, client_name, phone, client_source,
    appt_date, appt_time, is_first_visit, notes
  } = req.body;

  if (!service_id || !client_name || !phone || !appt_date || !appt_time) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const db = getDb();

  try {
    // BEGIN EXCLUSIVE TRANSACTION — prevents race conditions
    const createAppointment = db.transaction(() => {
      // Get service details
      const service = db.prepare('SELECT * FROM services WHERE id = ?').get(service_id);
      if (!service) throw { status: 404, error: 'Service not found' };

      // Check for conflicts (same date+time overlap)
      const BREAK = 30;
      const newStart = timeToMin(appt_time);
      const newEnd = newStart + service.duration_min;

      const existingAppts = db.prepare(`
        SELECT appt_time, duration_min FROM appointments
        WHERE appt_date = ? AND status != 'cancelled'
      `).all(appt_date);

      const blockedSlots = db.prepare(`
        SELECT start_time, end_time FROM blocked_slots WHERE blocked_date = ?
      `).all(appt_date);

      const allBusy = [
        ...existingAppts.map(a => {
          const s = timeToMin(a.appt_time);
          return [s, s + a.duration_min + BREAK];
        }),
        ...blockedSlots.map(b => [timeToMin(b.start_time), timeToMin(b.end_time)]),
      ];

      const conflict = allBusy.some(([s, e]) => newStart < e && newEnd > s);
      if (conflict) throw { status: 409, error: 'Slot already taken' };

      // Apply first-visit discount
      let finalPrice = service.price;
      let discountApplied = 0;
      if (is_first_visit) {
        discountApplied = Math.round(service.price * 0.15);
        finalPrice = service.price - discountApplied;
      }

      // Insert appointment
      const result = db.prepare(`
        INSERT INTO appointments
          (service_id, client_name, phone, client_source, appt_date, appt_time,
           duration_min, price, discount_applied, is_first_visit, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `).run(
        service_id, client_name, phone, client_source || null,
        appt_date, appt_time, service.duration_min,
        finalPrice, discountApplied, is_first_visit ? 1 : 0,
        notes || null
      );

      return {
        id: result.lastInsertRowid,
        service,
        finalPrice,
        discountApplied,
        appt_date,
        appt_time,
        client_name,
        phone,
      };
    });

    const appt = createAppointment();

    // Async notifications (don't block response)
    const dateFormatted = new Date(appt.appt_date).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', weekday: 'long'
    });

    notifyTelegram(
      `💄 <b>Новая запись!</b>\n` +
      `👤 ${appt.client_name} | ${appt.phone}\n` +
      `📅 ${dateFormatted}, ${appt.appt_time}\n` +
      `✨ ${appt.service.name} — ${appt.finalPrice} ₽` +
      (appt.discountApplied ? ` (-${appt.discountApplied} ₽ скидка первого визита)` : '')
    ).catch(console.error);

    sendSms(
      appt.phone,
      `Виктория записала вас на ${appt.appt_time} ${dateFormatted}. Адрес: Воронцово Поле ул., 12 (м.Таганская). LashLux Studio`
    ).catch(console.error);

    res.json({
      success: true,
      data: {
        id: appt.id,
        message: `Записала вас ✨`,
        appt_date: appt.appt_date,
        appt_time: appt.appt_time,
        service: appt.service.name,
        price: appt.finalPrice,
        discount: appt.discountApplied,
      }
    });

  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: 'Slot already taken. Please choose another time.' });
    }
    if (err.status === 404) {
      return res.status(404).json({ success: false, error: err.error });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/appointments (admin view)
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { date } = req.query;
    let query = `
      SELECT a.*, s.name as service_name, s.category
      FROM appointments a
      JOIN services s ON a.service_id = s.id
    `;
    const params = [];
    if (date) { query += ' WHERE a.appt_date = ?'; params.push(date); }
    query += ' ORDER BY a.appt_date, a.appt_time';
    const rows = db.prepare(query).all(...params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
