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

// Parse JSON bodies for API endpoints
app.use(express.json());

// --- Basic Auth ---
app.use(basicAuth({
  users: AUTH_USERS,
  challenge: true,
  realm: 'Sensor Data',
}));

// --- Static Frontend ---
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

// Ensure settings table exists and seed default values if necessary
async function initSettingsTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    // Simple key/value table where value is stored as text (can be JSON)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS web_settings (
        name VARCHAR(128) PRIMARY KEY,
        value TEXT
      )
    `);

    // Ensure sensible defaults exist
    const checkAndInsert = async (name, defaultValue) => {
      const r = await conn.query('SELECT value FROM web_settings WHERE name = ? LIMIT 1', [name]);
      if (!r || r.length === 0) {
        await conn.query('INSERT INTO web_settings (name, value) VALUES (?, ?)', [name, String(defaultValue)]);
        console.log(`Inserted default setting ${name}=${defaultValue}`);
      }
    };

    await checkAndInsert('videoLoopSeconds', 60);
    await checkAndInsert('screenSaverSeconds', 60);
  } catch (err) {
    console.error('Error initializing settings table:', err);
  } finally {
    if (conn) conn.release();
  }
}

// Run initialization asynchronously but don't block server startup too long
initSettingsTable();

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

// --- API: Settings (GET/POST) ---
app.get('/api/settings', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT name, value FROM web_settings");
    const out = {};
    for (const row of rows) {
      let raw = row.value;
      // Try to parse JSON values, otherwise try number, otherwise keep string
      try {
        out[row.name] = JSON.parse(raw);
      } catch (e) {
        // not JSON - try numeric
        const num = Number(raw);
        out[row.name] = Number.isFinite(num) ? num : raw;
      }
    }
    res.json(out);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

app.post('/api/settings', async (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Invalid settings payload' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    // Use simple upsert for each provided key
    for (const [k, v] of Object.entries(updates)) {
      // store primitives as strings; objects/arrays as JSON
      const stored = (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') ? String(v) : JSON.stringify(v);
      await conn.query('INSERT INTO web_settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [k, stored]);
    }

    // Return full settings after update
    const rows = await conn.query("SELECT name, value FROM web_settings");
    const out = {};
    for (const row of rows) {
      let raw = row.value;
      try {
        out[row.name] = JSON.parse(raw);
      } catch (e) {
        const num = Number(raw);
        out[row.name] = Number.isFinite(num) ? num : raw;
      }
    }
    res.json(out);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// --- Fallback: React SPA Routing ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'hallway', 'dist', 'index.html'));
});

// --- HTTPS Setup ---
const SSL_DOMAIN = "mbutki.com";
let sslOptions = {
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
