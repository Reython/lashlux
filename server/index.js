const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');
const { setupCronJobs } = require('./jobs/reminders');

const servicesRouter = require('./routes/services');
const slotsRouter = require('./routes/slots');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// Initialize DB on startup
getDb();

// API Routes
app.use('/api/services', servicesRouter);
app.use('/api/slots', slotsRouter);
app.use('/api/appointments', appointmentsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LashLux API running on http://localhost:${PORT}`);
  setupCronJobs();
});
