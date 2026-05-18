const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const os = require('os');

const PORT = 3000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

let leaderboard = [];

const server = http.createServer((req, res) => {
  // API endpoint to get server URL for QR
  if (req.url === '/api/server-info') {
    const ip = getLocalIP();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ip, port: PORT, url: `http://${ip}:${PORT}` }));
    return;
  }

  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': (MIME[ext] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'leaderboard', data: leaderboard }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      if (msg.type === 'submit_score') {
        const { name, score, time, total } = msg.data;
        leaderboard.push({ name, score, time, total, ts: Date.now() });
        leaderboard.sort((a, b) => b.score !== a.score ? b.score - a.score : a.time - b.time);
        leaderboard = leaderboard.slice(0, 20);
        broadcast({ type: 'leaderboard', data: leaderboard });
      }

      if (msg.type === 'reset') {
        leaderboard = [];
        broadcast({ type: 'leaderboard', data: leaderboard });
      }
    } catch (e) {}
  });
});

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg); });
}

const ip = getLocalIP();
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🎮  HCM202 Presentation Server`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  📍 Local:   http://localhost:${PORT}`);
  console.log(`  📍 Network: http://${ip}:${PORT}`);
  console.log(`  📱 Cho học sinh quét QR trên trang web!`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
