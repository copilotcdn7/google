const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// ============ VPS SUNUCULARINI BURAYA YAZ ============
const SERVERS = [
  'https://cd.sevix.store',   // Domain
  'https://cdn2.sevix.store',   // Domain
];
// =====================================================

let currentIndex = 0;

function getNextServer() {
  const target = SERVERS[currentIndex];
  currentIndex = (currentIndex + 1) % SERVERS.length;
  return target;
}

// 1. Health check - proxy'den ÖNCE!
app.get('/_health', (req, res) => {
  res.status(200).send('OK');
});

// 2. Proxy - tek middleware, dinamik hedef
const proxy = createProxyMiddleware({
  router: () => getNextServer(),
  changeOrigin: true,
  ws: true,
  secure: true,
  logLevel: 'silent',
  onError: (err, req, res) => {
    if (!res.headersSent) {
      res.status(502).json({ error: 'Service temporarily unavailable' });
    }
  }
});

app.use('/', proxy);

// 3. Port + WebSocket upgrade
const port = process.env.PORT || 8080;
const server = app.listen(port);
server.on('upgrade', proxy.upgrade);