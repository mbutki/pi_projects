const compression = require('compression');
const https = require("https");
const fs = require("fs").promises;
const readFileSync = require("fs").readFileSync;
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
//app.use(express.static(path.join(__dirname, 'frontend', 'main', 'build')));
app.use(express.static(path.join(__dirname, 'frontend', 'hallway', 'dist')));
app.use(express.static(path.join(__dirname, 'frontend', 'hallway', 'src', 'assets')));

// --- MariaDB Pool ---
const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 5,
})

async function getDirectoriesInDir(directoryPath) {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const directories = entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return directories;
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
    return []; // Return an empty array on error
  }
}

// --- API: Video List ---
app.get('/api/videos', async (req, res) => {
  const videosPath = path.join(__dirname, 'frontend', 'hallway', 'src', 'assets', 'videos');
  const dir2urls = {}
  try {
    const dirNames = await getDirectoriesInDir(videosPath);
    for (const dirName of dirNames) {
      const filenames = await fs.readdir(path.join(videosPath, dirName));
      const videoUrls = filenames.map(filename => {
        return `/videos/${dirName}/${filename}`;
      })
      dir2urls[dirName] = videoUrls;
    }
    res.json(dir2urls);
  }
  catch (error) {
    console.error('Error reading directory:', err);
    res.status(500).json({ error: 'Dir read error' });
    return
  }
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
      LIMIT 3000
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
      LIMIT 10
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
      LIMIT 50
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
  res.sendFile(path.join(__dirname, 'frontend', 'main', 'build', 'index.html'));
});

// --- HTTPS Setup ---
const SSL_DOMAIN = "mbutki.com";
const sslOptions = {
  key: readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem`),
  cert: readFileSync(`/etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem`)
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
