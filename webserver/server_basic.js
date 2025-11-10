const compression = require('compression');
const https = require("https");
const fs = require("fs");
const express = require('express');
const mariadb = require('mariadb');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, AUTH_USERS } = require('./secrets');

const app = express();
// Enable gzip compression for all responses
app.use(compression());

// --- Basic Auth ---
app.use(basicAuth({
  users: AUTH_USERS,
  challenge: true,
  realm: 'Sensor Data',
}));

// --- Static Frontend ---
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'assets')));

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
      WHERE end_ts >= UNIX_TIMESTAMP(NOW() - INTERVAL 2 DAY)
      ORDER BY end_ts DESC
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

// --- API: Sensor Error Data ---
app.get('/api/errors', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT location, timestamp, error
      FROM sensor_errors
      ORDER BY timestamp DESC
    `);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching errors:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Fallback: React SPA Routing ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// --- HTTPS Setup ---
const SSL_DOMAIN = "mbutki.com";
const sslOptions = {
  key: fs.readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem`),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem`)
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log(`🔒 HTTPS server running on https://${SSL_DOMAIN}`);
});

// Optional: HTTP → HTTPS redirect
require("http").createServer((req, res) => {
  res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
  res.end();
}).listen(80);

// Watch cert files and reload without restarting app
fs.watch(`/etc/letsencrypt/live/${SSL_DOMAIN}`, (event, filename) => {
  if (filename && (filename.endsWith('.pem'))) {
    console.log('🔄 Reloading SSL certificates...');
    sslOptions = {
      key: fs.readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem`),
      cert: fs.readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem`)
    };
  }
});
