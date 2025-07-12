const express = require('express');
const mariadb = require('mariadb');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, AUTH_USERS } = require('./secrets');

const app = express();
const PORT = 80;

// --- Basic Auth ---
app.use(basicAuth({
  users: AUTH_USERS,
  challenge: true,
  realm: 'Sensor Data',
}));

// --- Static Frontend ---
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// --- MariaDB Pool ---
const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 5,
});

// --- API: 5-Minute Medians ---
app.get('/api/5min-median', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT location, start_ts, end_ts, temp, humidity, pressure, lux, aqi
      FROM sensor_5min_median
      ORDER BY end_ts DESC
      LIMIT 1000
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching medians:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- API: Latest Sensor Data ---
app.get('/api/latest', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT location, timestamp, temp, humidity, pressure, lux, aqi
      FROM sensor_latest
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching latest:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Fallback: React SPA Routing ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

