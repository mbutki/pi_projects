const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mariadb = require('mariadb');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, AUTH_USERS } = require('./secrets');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 80;

// Basic Authentication
app.use(basicAuth({
  users: AUTH_USERS,
  challenge: true,
  realm: 'Sensor Data',
}));

// Serve React frontend static files
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// MariaDB pool
const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 5
});

// Periodic polling to push latest sensor data to clients
async function broadcastLatest() {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM sensor_latest");
    conn.release();

    const payload = JSON.stringify({ type: 'latest', data: rows });
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) ws.send(payload);
    });
  } catch (err) {
    console.error('WS DB error:', err);
  }
}

// Poll the DB every 1 second
setInterval(broadcastLatest, 1000);

// Sensor data API
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
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Sensor latest data API
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
    console.error('DB error (latest):', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fallback for React Router SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
