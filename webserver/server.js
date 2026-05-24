const compression = require('compression');
const https = require("https");
const fs = require("fs").promises;
const readFileSync = require("fs").readFileSync;
const express = require('express');
const mariadb = require('mariadb');
const EventEmitter = require('events');
const path = require('path');
const session = require('express-session');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, AUTH_USERS, SESSION_SECRET } = require('./secrets');

const app = express();
// Enable gzip compression for all responses
app.use(compression());

// Parse JSON bodies for API endpoints
app.use(express.json());

// --- Session Configuration ---
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  }
}));

// --- Authentication Middleware ---
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// --- Login Endpoint ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (AUTH_USERS[username] && AUTH_USERS[username] === password) {
    req.session.authenticated = true;
    req.session.username = username;
    res.json({ ok: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- Logout Endpoint ---
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ ok: true, message: 'Logged out' });
  });
});

// --- Check Auth Status Endpoint ---
app.get('/api/auth-status', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

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

const sensorEvents = new EventEmitter();

// Local cache to deduplicate broadcasts
let lastLatestData = '';

// Poll the DB and broadcast via SSE if data has changed
const broadcastLatest = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT location, timestamp, temp, humidity, pressure, lux, aqi, wifi
      FROM sensor_latest
      LIMIT 10
    `);
    const currentData = JSON.stringify(rows);
    if (currentData !== lastLatestData) {
      lastLatestData = currentData;
      sensorEvents.emit('latest_update', rows);
    }
  } catch (err) {
    console.error('SSE broadcast error:', err);
  } finally {
    if (conn) conn.release();
  }
};
setInterval(broadcastLatest, 300);

const { exec } = require('child_process');

// Whitelist of allowed triangle sketches — keep this in sync with frontend buttons
const TRIANGLE_SKETCHES = [
  'triangle16_attractor.py',
  'triangle16_radiance.py --mode spatial',
  'triangle16_snake.py',
  'triangle16_cellular_automata.py',
  'triangle16_perlin.py',
  'triangle16_reaction_diffusion.py',
  'triangle16_heat.py',
  'triangle16_randomwalk.py',
  'triangle16_kaleidoscope.py',
  'triangle16_fibonacci.py',
  'triangle16_lorenz.py',
  'triangle16_voronoi.py',
  'triangle16_tessellation.py',
  'triangle16_traveling_lights.py',
  'triangle16_flocking.py',
  'triangle16_christmas.py'
];
// SSH user to connect as on pi-triangle. Defaults to the local service user 'mbutki',
// but can be overridden via the SSH_USER env var if needed.
const SSH_USER = process.env.SSH_USER || 'mbutki';

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

// --- Apply authentication to all /api routes (except /api/login, /api/auth-status) ---
app.use('/api/videos', requireAuth);
app.use('/api/5min-median', requireAuth);
app.use('/api/latest', requireAuth);
app.use('/api/latest/sse', requireAuth);
app.use('/api/errors', requireAuth);
app.use('/api/settings', requireAuth);
app.use('/api/triangle', requireAuth);

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
      SELECT location, start_ts, end_ts, temp, humidity, pressure, lux, aqi, wifi
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
      SELECT location, timestamp, temp, humidity, pressure, lux, aqi, wifi
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

// --- API: Latest Sensor Data (SSE) ---
app.get('/api/latest/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const sendUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (res.flush) res.flush(); // Push data through compression buffer immediately
  };

  sensorEvents.on('latest_update', sendUpdate);

  // Keep-alive heartbeat to prevent timeouts from proxies/Nginx
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
    if (res.flush) res.flush();
  }, 30000);

  req.on('close', () => {
    sensorEvents.off('latest_update', sendUpdate);
    clearInterval(heartbeat);
    res.end();
  });
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

// --- API: Run triangle sketch on pi-triangle ---
app.post('/api/triangle/sketch', async (req, res) => {
  const { sketch } = req.body || {};
  if (!sketch || typeof sketch !== 'string') {
    return res.status(400).json({ error: 'Missing sketch name' });
  }

  if (!TRIANGLE_SKETCHES.includes(sketch)) {
    return res.status(400).json({ error: 'Sketch not allowed' });
  }

  const remoteCmd = `systemctl --user stop triangle.service ; systemd-run --user --unit=triangle -d python /home/mbutki/pi_projects/python/src/displays/triangle/${sketch}`;
  const cmd = `sudo -u mbutki ssh mbutki@pi-triangle '${remoteCmd}'`;

  exec(cmd, { timeout: 30_000 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Error running triangle sketch command:', err, stdout, stderr);
      return res.status(500).json({ error: 'Failed to run remote command', details: String(err), stdout, stderr });
    }
    res.json({ ok: true, stdout, stderr });
  });
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
