const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// Convert "HH:MM" to minutes since midnight
function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes to "HH:MM"
function minToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, '0');
  const min = (m % 60).toString().padStart(2, '0');
  return `${h}:${min}`;
}

// GET /api/slots/available?date=YYYY-MM-DD&duration=150
router.get('/available', (req, res) => {
  try {
    const { date, duration } = req.query;
    if (!date) return res.status(400).json({ success: false, error: 'date is required' });

    const db = getDb();
    const serviceDuration = parseInt(duration) || 120;

    const WORK_START = 11 * 60;   // 11:00
    const WORK_END = 21 * 60;     // 21:00
    const BREAK_BETWEEN = 30;     // 30 min gap

    // Get booked appointments for that date (not cancelled)
    const booked = db.prepare(`
      SELECT appt_time, duration_min FROM appointments
      WHERE appt_date = ? AND status != 'cancelled'
    `).all(date);

    // Get blocked slots for that date
    const blocked = db.prepare(`
      SELECT start_time, end_time FROM blocked_slots WHERE blocked_date = ?
    `).all(date);

    // Build busy ranges [start, end] in minutes
    const busyRanges = [
      ...booked.map(a => {
        const start = timeToMin(a.appt_time);
        return [start, start + a.duration_min + BREAK_BETWEEN];
      }),
      ...blocked.map(b => [timeToMin(b.start_time), timeToMin(b.end_time)]),
    ];

    // Generate candidate slots every 30 minutes
    const slots = [];
    for (let t = WORK_START; t + serviceDuration <= WORK_END; t += 30) {
      const slotEnd = t + serviceDuration;
      const isFree = !busyRanges.some(([s, e]) => t < e && slotEnd > s);
      if (isFree) slots.push(minToTime(t));
    }

    res.json({ success: true, date, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
