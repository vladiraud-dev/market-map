// MarketMap — локальный сервер без зависимостей (нужен Node.js 18+).
// Отдаёт сайт и пересылает запросы к API бирж, чтобы браузер не упирался в CORS.
// Запуск: node server.js   →   http://localhost:8080
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = +process.env.PORT || 8080;
const ROOT = __dirname;
const HOSTS = {
  bf: 'https://fapi.binance.com',
  bs: 'https://api.binance.com',
  by: 'https://api.bybit.com',
  bg: 'https://api.bitget.com',
  ok: 'https://www.okx.com',
  tg: 'https://api.telegram.org',
};
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

if (typeof fetch !== 'function') {
  console.error('\nНужен Node.js версии 18 или новее. Скачай с https://nodejs.org (кнопка LTS).\n');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');

  if (u.pathname === '/proxy/health') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    return res.end('{"ok":true}');
  }

  const m = u.pathname.match(/^\/proxy\/(bf|bs|by|bg|ok|tg)(\/.*)$/);
  if (m) {
    if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
    try {
      const r = await fetch(HOSTS[m[1]] + m[2] + u.search, { headers: { 'user-agent': 'MarketMap/1.0' } });
      const body = Buffer.from(await r.arrayBuffer());
      res.writeHead(r.status, {
        'content-type': r.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
        'access-control-allow-origin': '*',
      });
      return res.end(body);
    } catch (e) {
      res.writeHead(502, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: String(e && e.message || e) }));
    }
  }

  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); return res.end('Не найдено'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(data);
  });
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') console.error(`\nПорт ${PORT} занят. Закрой другое окно с сервером или запусти так: set PORT=8090 && node server.js\n`);
  else console.error(e);
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  MarketMap запущен:  http://localhost:' + PORT);
  console.log('  Не закрывай это окно, пока пользуешься сайтом.\n');
});
