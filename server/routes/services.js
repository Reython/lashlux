const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/services
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const services = db.prepare(`
      SELECT * FROM services WHERE is_active = 1 ORDER BY id
    `).all();

    // Group by category
    const grouped = services.reduce((acc, svc) => {
      if (!acc[svc.category]) acc[svc.category] = [];
      acc[svc.category].push(svc);
      return acc;
    }, {});

    res.json({ success: true, data: grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

module.exports = router;
