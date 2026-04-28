const cron = require('node-cron');
const { getDb } = require('../db');

// Stub SMS sender
async function sendSms(phone, msg) {
  console.log(`[SMS STUB] → ${phone}: ${msg}`);
  // TODO: process.env.SMSRU_API_KEY
}

// Stub Telegram sender
async function sendTelegram(msg) {
  console.log(`[TELEGRAM STUB] → ${msg}`);
  // TODO: process.env.TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
}

function setupCronJobs() {
  // 10:00 every day — SMS reminder for tomorrow's clients
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Running daily SMS reminders...');
    try {
      const db = getDb();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const appts = db.prepare(`
        SELECT a.*, s.name as service_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.appt_date = ? AND a.status = 'confirmed' AND a.reminder_sent = 0
      `).all(dateStr);

      for (const appt of appts) {
        const msg = `Привет, ${appt.client_name}! Завтра в ${appt.appt_time} ждём вас у Виктории. Адрес: Воронцово Поле ул., 12 (м.Таганская). Не ешьте за час. Возьми хорошее настроение 🤍 — LashLux Studio`;
        await sendSms(appt.phone, msg);
        db.prepare('UPDATE appointments SET reminder_sent = 1 WHERE id = ?').run(appt.id);
      }
      console.log(`[CRON] Sent ${appts.length} reminders for ${dateStr}`);
    } catch (err) {
      console.error('[CRON] SMS reminder error:', err);
    }
  }, { timezone: 'Europe/Moscow' });

  // 20:00 every day — Telegram daily summary to Victoria
  cron.schedule('0 20 * * *', async () => {
    console.log('[CRON] Sending daily summary to Victoria...');
    try {
      const db = getDb();
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const todayAppts = db.prepare(`
        SELECT COUNT(*) as cnt, SUM(price) as total
        FROM appointments WHERE appt_date = ? AND status = 'confirmed'
      `).get(today);

      const tomorrowCount = db.prepare(`
        SELECT COUNT(*) as cnt FROM appointments
        WHERE appt_date = ? AND status = 'confirmed'
      `).get(tomorrowStr);

      const msg =
        `💄 <b>LashLux сегодня (${today}):</b>\n` +
        `Клиенток: ${todayAppts.cnt || 0} | Выручка: ${todayAppts.total || 0} ₽\n` +
        `Завтра записей: ${tomorrowCount.cnt || 0}`;

      await sendTelegram(msg);
    } catch (err) {
      console.error('[CRON] Daily summary error:', err);
    }
  }, { timezone: 'Europe/Moscow' });

  console.log('✅ Cron jobs initialized');
}

module.exports = { setupCronJobs };
